import auth from '@react-native-firebase/auth';

// Create or sign-in user with Firebase
// returns id and isNewUser
const initializeFirebaseUser = async (email: string) => {
  try {
    // create user
    const userCreated = await auth().createUserWithEmailAndPassword(
      email,
      '123456789!',
    );

    return {
      id: userCreated.user.uid,
      isNewUser: userCreated.additionalUserInfo?.isNewUser,
    };
  } catch (error) {
    console.log('error', error);

    if (error.code === 'auth/email-already-in-use') {
      const userSigned = await auth().signInWithEmailAndPassword(
        email,
        '123456789!',
      );

      return {
        id: userSigned.user.uid,
        isNewUser: userSigned.additionalUserInfo?.isNewUser,
      };
    }

    return null;
  }
};

export default initializeFirebaseUser;
