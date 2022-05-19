import firestore from '@react-native-firebase/firestore';
import type {GitWatchUser} from 'types';

// Create current user data
const createUserData = async (data: GitWatchUser) => {
  try {
    await firestore().collection('Users').doc(data.id).set(data);
  } catch (err) {
    console.log('createUserData error', err);
    throw err;
  }
};

export default createUserData;
