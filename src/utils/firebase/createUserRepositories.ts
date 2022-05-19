import firestore from '@react-native-firebase/firestore';
import type {GQLRepository} from 'graphql/schema';

// Create current user suggested repositories in DB
const createUserRepositories = async (
  userId: string,
  repositories: GQLRepository[],
) => {
  await firestore().collection('Repositories').doc(userId).set({
    suggested: repositories,
  });
};

export default createUserRepositories;
