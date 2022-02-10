import React, {useState} from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {DraftIcon, PullRequestIcon} from 'components/Icons';
import openExternalLink from 'utils/openExternalLink';
import {
  GQLPullRequest,
  GQLPullRequestReviewDecision,
  GQLRepository,
} from 'graphql/schema';
import {useUserData} from 'hooks/useUserData';
import GithubPullRequestCard from 'components/GithubPullRequestCard';
import getRepositoriesPullRequests from 'api/github/getRepositoriesPullRequests';
import getUserPullRequests from 'api/github/getUserPullRequests';

interface IPullRequestsTab {}

const PullRequestsTabScreen = ({}: IPullRequestsTab) => {
  const [repositories, setRepositories] = React.useState<GQLRepository[]>([]);
  const [pullRequests, setPullRequests] = useState<GQLPullRequest[]>();

  const {data: userData} = useUserData();

  const [refreshing, setRefreshing] = React.useState(false);

  const getPullRequests = async () => {
    if (userData?.managerMode) {
      const pullRequests = await getRepositoriesPullRequests(repositories);
      setPullRequests(pullRequests);
    } else {
      const userPullRequests = await getUserPullRequests(
        userData?.login as string,
      );
      setPullRequests(userPullRequests);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([getPullRequests]).finally(() => setRefreshing(false));
    } catch (e) {
      console.error(e);
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
  }, [repositories, userData?.managerMode]);

  return (
    <ScrollView
      style={{flex: 1}}
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
