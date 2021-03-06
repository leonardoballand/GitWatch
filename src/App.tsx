import React, {useEffect} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import auth from '@react-native-firebase/auth';
import {enableFreeze} from 'react-native-screens';

import SelectRepositoryScreen from 'screens/Authorized/SettingsScreen/SelectRepositoryScreen';
import OnboardingScreen from 'screens/Unauthorized/OnboardingScreen';
import LoginScreen from 'screens/Unauthorized/LoginScreen';
import HomeScreen from 'screens/Authorized/HomeScreen';
import ConfigurationScreen from 'screens/Authorized/ConfigurationScreen';
import PullRequestDetailsScreen from 'screens/Authorized/PullRequestDetails';
import withProviders from 'withProviders';
import {AppStackParamsList} from 'types';
import ManageAccountScreen from 'screens/Authorized/SettingsScreen/ManageAccountScreen';
import FeedbacksScreen from 'screens/Authorized/SettingsScreen/FeedbacksScreen';
import useFirebaseUpdates from 'hooks/useFirebaseUpdates';
import AppUpdateScreen from 'screens/Authorized/AppUpdateScreen';
import {FirebaseAppDistributionTypes} from '@react-native-firebase/app-distribution';
import AboutScreen from 'screens/Authorized/SettingsScreen/AboutScreen';
import useStore from 'store';

enableFreeze(true);

const {Navigator, Screen} = createNativeStackNavigator<AppStackParamsList>();

interface IProps {}

const App = withProviders(({}: IProps) => {
  const {navigate} = useNavigation<NavigationProp<AppStackParamsList>>();
  const {user, deleteUser} = useStore(state => ({
    user: state.user,
    deleteUser: state.deleteUser,
  }));

  const openAppUpdateModal = (
    data: FirebaseAppDistributionTypes.AppDistributionRelease,
  ) => navigate('AppUpdate', data);

  useFirebaseUpdates(openAppUpdateModal);

  // Handle user state changes
  const onAuthStateChanged = (firebaseUser: any) => {
    if (!firebaseUser) {
      // remove user data
      deleteUser();
    }
  };

  // Set Firebase Auth Listener on did mount
  // Remove listener on unmount
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    function displayConfiguration() {
      if (user?.isNewUser) {
        // LoginScreen set isNewUser + repositories.suggested + organizations.suggested key
        navigate('Configuration', {
          repositories: user.repositories.suggested,
          organizations: user.organizations.suggested,
        });
      }
    }

    displayConfiguration();
  }, [user?.isNewUser]);

  // Initialize app
  // When user is not connected (using Firebase native authentication module)
  // - Set Github data in userData
  // - Initialize Firebase user in Firestore DB
  // - Create user data in Firestore DB
  // useEffect(() => {
  //   async function initApp() {
  //     if (!loading) {
  //       setInitializing(false);
  //     }
  //   }

  //   initApp();
  // }, [loading]);

  // Remove splashscreen when app is ready
  useEffect(() => {
    function showApp() {
      RNBootSplash.hide({fade: true});
    }

    showApp();
  }, []);

  return (
    <Navigator
      initialRouteName={auth().currentUser ? 'Home' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
      }}>
      {auth().currentUser && user ? (
        <>
          <Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />

          <Screen
            name="SelectRepositories"
            component={SelectRepositoryScreen}
          />

          <Screen
            name="ManageAccount"
            component={ManageAccountScreen}
            options={{
              presentation: 'fullScreenModal',
            }}
          />

          <Screen
            name="Configuration"
            component={ConfigurationScreen}
            options={{
              presentation: 'fullScreenModal',
            }}
          />

          <Screen
            name="PullRequestDetails"
            component={PullRequestDetailsScreen}
          />

          <Screen
            name="Feedbacks"
            component={FeedbacksScreen}
            options={{
              presentation: 'formSheet',
            }}
          />

          <Screen
            name="AppUpdate"
            component={AppUpdateScreen}
            options={{
              presentation: 'formSheet',
            }}
          />

          <Screen name="About" component={AboutScreen} />
        </>
      ) : (
        <>
          <Screen name="Onboarding" component={OnboardingScreen} />
          <Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Navigator>
  );
});

export default App;
