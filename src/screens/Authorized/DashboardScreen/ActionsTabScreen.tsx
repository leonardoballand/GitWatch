import React, {useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import GithubActionCard from 'components/GithubActionCard';
import {
  ActionCompletedIcon,
  ActionFailedIcon,
  ActionPendingIcon,
  ActionStoppedIcon,
} from 'components/Icons';
import openExternalLink from 'utils/openExternalLink';
import {GQLRepository, GQLWorkflow} from 'graphql/schema';
import {useUserData} from 'hooks/useUserData';
import getRepositoryGithubActions from 'api/github/getRepositoryGithubActions';

interface IActionsTab {}

const ActionsTabScreen = ({}: IActionsTab) => {
  const {data: userData} = useUserData();

  const [repositories, setRepositories] = React.useState<GQLRepository[]>([]);
  const [workflows, setWorkflows] = useState<GQLWorkflow[]>([]);

  const [refreshing, setRefreshing] = React.useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([getActionsFromRepositories()]).finally(() =>
        setRefreshing(false),
      );
    } catch (e) {
      console.error(e);
    }
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
    getActionsFromRepositories();
  }, [repositories, userData?.managerMode]);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#F8F8F8'}}
      contentContainerStyle={{
        flexGrow: 1,
        marginHorizontal: 16,
        paddingTop: 24,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {workflows?.length ? (
        workflows.map(workflow => (
          <GithubActionCard
            key={String(workflow.id)}
            icon={renderActionItemStatus(workflow.status, workflow.conclusion)}
            title={workflow.head_commit.message.split('\n')[0]}
            description={workflow.name}
            label={workflow.head_repository.name}
            author={workflow.head_commit.author.name}
            branch={workflow.head_branch}
            time={new Date(workflow.run_started_at)}
            onPress={() => openExternalLink(workflow.html_url)}
          />
        ))
      ) : (
        <Text appearance="hint" category="c1">
          No Github Action
        </Text>
      )}
    </ScrollView>
  );
};

export default ActionsTabScreen;
