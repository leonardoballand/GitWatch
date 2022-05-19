import React from 'react';
import {ImageProps, RefreshControl, ScrollView} from 'react-native';
import {Avatar, Divider, ListItem, Text} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import openExternalLink from 'utils/openExternalLink';
import {GQLPullRequest, GQLRepository} from 'graphql/schema';
import getRepositoriesReviews from 'api/github/getRepositoriesReviews';
import getUserAssignedReviews from 'api/github/getUserAssignedReviews';
import useStore from 'store';

interface IReviewsTab {}

const ReviewsTabScreen = ({}: IReviewsTab) => {
  const {user} = useStore(state => ({user: state.user}));

  const [repositories, setRepositories] = React.useState<GQLRepository[]>([]);
  const [reviews, setReviews] = React.useState<GQLPullRequest[]>([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const getReviews = async () => {
    try {
      const userReviews = user?.managerMode
        ? await getRepositoriesReviews(repositories)
        : await getUserAssignedReviews(user?.login as string);

      setReviews(userReviews);

      return;
    } catch (err) {
      console.log('reviews error', err);

      Toast.show({
        type: 'error',
        text1: 'An error occurred',
        text2: 'Could not get reviews.',
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([getReviews()]);
    } catch (e) {
      console.error(e);

      Toast.show({
        type: 'error',
        text1: 'An error occurred',
        text2: 'Could not refresh reviews.',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const renderItemImage = (
    uri: string,
    props: Partial<ImageProps> | undefined,
  ) => {
    return <Avatar {...props} style={[props?.style]} source={{uri}} />;
  };

  const renderItemAuthor = (author: string) => (
    <Text category="c1">{author}</Text>
  );

  const openReview = (url: string) => openExternalLink(url);

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
    getReviews();
  }, [repositories, user?.managerMode]);

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#F8F8F8'}}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {reviews?.length ? (
        reviews.map(review => (
          <React.Fragment key={review.id}>
            <ListItem
              key={review.id}
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
              onPress={() => openReview(review.url)}
            />
            <Divider />
          </React.Fragment>
        ))
      ) : (
        <Text appearance="hint" category="c1">
          No review
        </Text>
      )}
    </ScrollView>
  );
};

export default ReviewsTabScreen;
