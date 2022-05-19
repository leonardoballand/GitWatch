import firestore from '@react-native-firebase/firestore';

// Create current user suggested organizations in DB
const createUserOrganizations = async (
  userId: string,
  organizations: string[],
) => {
  await firestore().collection('Organizations').doc(userId).set({
    suggested: organizations,
  });
};

export default createUserOrganizations;
