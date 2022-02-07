import * as React from 'react';
import {
  ImageProps,
  Linking,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {Avatar, ListItem, Text, useTheme} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import getRepositoriesPullRequests from 'api/github/getRepositoriesPullRequests';
import getRepositoriesReviews from 'api/github/getRepositoriesReviews';
import getUserAssignedReviews from 'api/github/getUserAssignedReviews';
import getUserPullRequests from 'api/github/getUserPullRequests';
import AppHeader from 'components/AppHeader';
import {
  GQLPullRequest,
  GQLPullRequestReviewDecision,
  GQLRepository,
  GQLWorkflow,
  GQLWorkflowRun,
} from 'graphql/schema';
import {GitWatchUser, TabStackParamsList} from 'types';
import {useUserData} from 'hooks/useUserData';
import {
  WorkflowIcon,
  PullRequestIcon,
  ReadyIcon,
  ReviewIcon,
  FileIcon,
  ActionCompletedIcon,
  ActionPendingIcon,
  ActionStoppedIcon,
  ActionFailedIcon,
  NotificationsIcon,
  DraftIcon,
} from 'components/Icons';
import getRepositoryGithubActions from 'api/github/getRepositoryGithubActions';
import GithubActionCard from 'components/GithubActionCard';
import SectionHeader from 'components/SectionHeader';
import GithubPullRequestCard from 'components/GithubPullRequestCard';

type Props = NativeStackScreenProps<TabStackParamsList, 'Dashboard'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function DashboardScreen() {
  const {data: userData} = useUserData<GitWatchUser>();
  const {navigate} = useNavigation<NavigationProps>();
  const theme = useTheme();

  const [refreshing, setRefreshing] = React.useState(false);
  const [repositories, setRepositories] = React.useState<GQLRepository[]>([]);
  const [workflows, setWorkflows] = React.useState<GQLWorkflowRun[]>([]);
  const [reviews, setReviews] = React.useState<GQLPullRequest[]>([]);
  const [pullRequests, setPullRequests] = React.useState<GQLPullRequest[]>([]);

  const getActionsFromRepositories = async () => {
    const showWorkflowUserOnly = !userData?.managerMode;

    const promises = repositories!.map(repository =>
      getRepositoryGithubActions(repository.owner.login, repository.name),
    );

    const repositoriesActions = await Promise.all(promises);

    const activeWorkflows = [].concat.apply(
      [],
      repositoriesActions
        .filter(
          repositoryActions => repositoryActions.total_count > 0, // remove actions without runs
        )
        .map(
          filteredRepositoryActions => filteredRepositoryActions.workflow_runs,
        ),
    );

    const actions = activeWorkflows.filter(workflow => {
      if (!showWorkflowUserOnly) {
        // returns all actions
        return true;
      }

      // remove actions when user is not author
      return (
        workflow.head_commit.author.email === userData?.email ||
        workflow.head_commit.author.name === userData?.name
      );
    });

    setWorkflows(actions);

    return;
  };

  const getReviews = async () => {
    const userReviews = userData?.managerMode
      ? await getRepositoriesReviews(repositories)
      : await getUserAssignedReviews(userData?.login as string);

    setReviews(userReviews);

    return;
  };

  const getPullRequests = async () => {
    const userPullRequests = userData?.managerMode
      ? await getRepositoriesPullRequests(repositories)
      : await getUserPullRequests(userData?.login as string);

    setPullRequests(userPullRequests);

    return;
  };

  const onPullRequestPress = (pullRequest: GQLPullRequest) => {
    navigate('PullRequestDetails', {data: pullRequest});
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([getActionsFromRepositories(), getReviews()]).finally(
        () => setRefreshing(false),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const renderItemImage = (
    uri: string,
    props: Partial<ImageProps> | undefined,
  ) => {
    return <Avatar {...props} style={[props?.style]} source={{uri}} />;
  };

  const renderActionItemStatus = (status: string, conclusion: string) => {
    let Icon: JSX.Element | null = null;

    if (status === 'completed') {
      switch (conclusion) {
        case 'success':
          Icon = <ActionCompletedIcon />;
          break;
        case 'cancelled':
          Icon = <ActionStoppedIcon />;
          break;
        case 'failure':
          Icon = <ActionFailedIcon />;
          break;
      }
    } else {
      Icon = <ActionPendingIcon />;
    }

    return Icon;
  };

  const renderItemStatus = (
    isDraft: boolean,
    props: Partial<ImageProps> | undefined,
  ) => {
    return (
      <ReadyIcon
        color={
          isDraft ? theme['color-warning-500'] : theme['color-success-500']
        }
        {...props}
      />
    );
  };

  const renderPullRequestIcon = (isDraft: boolean) => {
    if (isDraft) {
      return <DraftIcon color="rgb(139, 148, 158)" />;
    }

    return <PullRequestIcon color="rgb(63, 185, 80)" />;
  };

  const renderPullRequestStatus = (
    reviewDecision: GQLPullRequestReviewDecision,
  ) => {
    switch (reviewDecision) {
      case 'APPROVED':
        return 'Approved';
      case 'CHANGES_REQUESTED':
        return 'Changes requested';
      case 'REVIEW_REQUIRED':
        return 'Review required';
    }
  };

  const renderItemAuthor = (author: string) => (
    <Text category="c1">{author}</Text>
  );

  const fetchActions = () => {
    if (repositories?.length) {
      getActionsFromRepositories();
      getPullRequests();
      getReviews();
    }
  };

  const openItemLink = (url: string) => Linking.openURL(url);

  const openNotifications = () => {};

  const renderRightAction = () => {
    return (
      <TouchableOpacity disabled onPress={openNotifications}>
        <NotificationsIcon color={theme['color-basic-500']} />
      </TouchableOpacity>
    );
  };

  // Fetch repositories actions
  React.useEffect(() => {
    fetchActions();
  }, [repositories, userData?.managerMode]);

  // Firestore listener for user repositories
  React.useEffect(() => {
    const userId = auth().currentUser?.uid;

    const subscriber = firestore()
      .collection('Repositories')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        console.log('documentSnapshot repo', documentSnapshot?.data());
        setRepositories(documentSnapshot?.data()?.repositories);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  // Everhour examples
  // React.useEffect(() => {
  //   getAllProjects('components.mobile');
  //   getProject('gh:286967155');
  //   getProjectTasks('gh:286967155');
  // }, []);

  return (
    <ScrollView
      style={{backgroundColor: '#F8F8F8'}}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <AppHeader
        title={`Hi ${userData?.firstName}`}
        description="Let's watch your repositories"
        level={1}
        color="#F8F8F8"
        accessoryRight={renderRightAction}
      />

      <View style={{marginHorizontal: 16}}>
        <View>
          <SectionHeader
            icon={<WorkflowIcon />}
            title="Github Actions"
            rightActionLabel="See more"
            onRightActionPress={() => {}}
            rightActionDisabled
          />

          {workflows?.length ? (
            workflows.map(workflow => (
              <GithubActionCard
                key={String(workflow.id)}
                icon={renderActionItemStatus(
                  workflow.status,
                  workflow.conclusion,
                )}
                title={workflow.head_commit.message.split('\n')[0]}
                description={workflow.name}
                label={workflow.head_repository.name}
                author={workflow.head_commit.author.name}
                branch={workflow.head_branch}
                time={new Date(workflow.run_started_at)}
                onPress={() => openItemLink(workflow.html_url)}
              />
            ))
          ) : (
            <Text appearance="hint" category="c1">
              No Github Action
            </Text>
          )}
        </View>

        <View>
          <SectionHeader
            icon={<PullRequestIcon />}
            title="Pull requests"
            // rightActionLabel="See more"
            // onRightActionPress={() => {}}
            // rightActionDisabled
          />

          {pullRequests?.length ? (
            pullRequests.map(pullRequest => (
              <GithubPullRequestCard
                title={pullRequest.title}
                description={pullRequest.author?.login}
                icon={renderPullRequestIcon(pullRequest.isDraft)}
                label={pullRequest.repository.name}
                author={pullRequest.author?.login}
                branch={renderPullRequestStatus(pullRequest.reviewDecision!)}
                time={new Date(pullRequest.createdAt)}
                reviewers={pullRequest.reviewRequests?.edges?.map(
                  edge => edge.node?.requestedReviewer,
                )}
                isDraft={pullRequest.isDraft}
                onPress={() => openItemLink(pullRequest.url)}
              />
            ))
          ) : (
            <Text appearance="hint" category="c1">
              No pull request
            </Text>
          )}
        </View>

        <View>
          <SectionHeader
            icon={<ReviewIcon />}
            title="Reviews"
            // rightActionLabel="See more"
            // onRightActionPress={() => {}}
            // rightActionDisabled
          />

          {reviews?.length ? (
            reviews.map(review => (
              <ListItem
                title={review.title}
                description={review.repository.name}
                accessoryLeft={props =>
                  renderItemImage(review.repository.owner.avatarUrl, props)
                }
                accessoryRight={() =>
                  renderItemAuthor(
                    `${review.changedFiles} file${
                      review.changedFiles > 1 ? 's' : ''
                    } changed`,
                  )
                }
              />
            ))
          ) : (
            <Text appearance="hint" category="c1">
              No review
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default DashboardScreen;
