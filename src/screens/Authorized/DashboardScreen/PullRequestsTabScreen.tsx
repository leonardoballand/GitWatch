import React, {useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import {DraftIcon, PullRequestIcon} from 'components/Icons';
import openExternalLink from 'utils/openExternalLink';
import {
  GQLPullRequest,
  GQLPullRequestReviewDecision,
  GQLRepository,
} from 'graphql/schema';
import GithubPullRequestCard from 'components/GithubPullRequestCard';
import getRepositoriesPullRequests from 'api/github/getRepositoriesPullRequests';
import getUserPullRequests from 'api/github/getUserPullRequests';
import useStore from 'store';

interface IPullRequestsTab {}

const PullRequestsTabScreen = ({}: IPullRequestsTab) => {
  const [repositories, setRepositories] = React.useState<GQLRepository[]>([]);
  const [pullRequests, setPullRequests] = useState<GQLPullRequest[]>();

  const {user} = useStore(state => ({user: state.user}));

  const [refreshing, setRefreshing] = React.useState(false);

  const getPullRequests = async () => {
    try {
      if (user?.managerMode) {
        const pullRequests = await getRepositoriesPullRequests(repositories);
        setPullRequests(pullRequests);
      } else {
        const userPullRequests = await getUserPullRequests(
          user?.login as string,
        );
        setPullRequests(userPullRequests);
      }

      return;
    } catch (err) {
      console.log('pullrequests error', err);

      Toast.show({
        type: 'error',
        text1: 'An error occurred',
        text2: 'Could not get pull requests.',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([getPullRequests]);
    } catch (e) {
      console.error(e);

      Toast.show({
        type: 'error',
        text1: 'An error occurred',
        text2: 'Could not refresh pull requests.',
      });
    } finally {
      setRefreshing(false);
    }
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

  // Firestore listener for user repositories
  React.useEffect(() => {
    const userId = auth().currentUser?.uid;

    const subscriber = firestore()
      .collection('Repositories')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        setRepositories(documentSnapshot?.data()?.repositories);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  // Fetch repositories actions
  React.useEffect(() => {
    getPullRequests();
  }, [repositories, user?.managerMode]);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#F8F8F8'}}
      contentContainerStyle={{flexGrow: 1, marginHorizontal: 16}}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
              edge => edge?.node?.requestedReviewer,
            )}
            isDraft={pullRequest.isDraft}
            onPress={() => openExternalLink(pullRequest.url)}
          />
        ))
      ) : (
        <Text appearance="hint" category="c1">
          No pull request
        </Text>
      )}
    </ScrollView>
  );
};

export default PullRequestsTabScreen;
