import React, {useEffect, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import auth from '@react-native-firebase/auth';
import {enableFreeze} from 'react-native-screens';

import SelectRepositoryScreen from 'screens/Authorized/SettingsScreen/SelectRepositoryScreen';
import OnboardingScreen from 'screens/Unauthorized/OnboardingScreen';
import LoginScreen from 'screens/Unauthorized/LoginScreen';
import {useUserData} from './hooks/useUserData';
import HomeScreen from 'screens/Authorized/HomeScreen';
import ConfigurationScreen from 'screens/Authorized/ConfigurationScreen';
import PullRequestDetailsScreen from 'screens/Authorized/PullRequestDetails';
import withProviders from 'withProviders';
import {AppStackParamsList} from 'types';
import ManageAccountScreen from 'screens/Authorized/SettingsScreen/ManageAccountScreen';

enableFreeze(true);

const {Navigator, Screen} = createNativeStackNavigator<AppStackParamsList>();

interface IProps {
  loading: boolean;
}

const App = withProviders(({loading}: IProps) => {
  const {data: userData, deleteUser} = useUserData();
  const {navigate} = useNavigation<NavigationProp<AppStackParamsList>>();

  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  const onAuthStateChanged = (user: any) => {
    if (!user) {
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
      if (userData?.isNewUser) {
        // LoginScreen set isNewUser + repositories.suggested + organizations.suggested key
        navigate('Configuration', {
          repositories: userData.repositories.suggested,
          organizations: userData.organizations.suggested,
        });
      }
    }

    displayConfiguration();
  }, [userData?.isNewUser]);

  // Initialize app
  // When user is not connected (using Firebase native authentication module)
  // - Set Github data in userData
  // - Initialize Firebase user in Firestore DB
  // - Create user data in Firestore DB
  useEffect(() => {
    async function initApp() {
      if (!loading) {
        // Check if user is Firebase connected (see LoginScreen)
        // after Github login
        // if (userData && !auth().currentUser) {
        //   console.log('user is not connected');
        // } else {
        //   console.log('user is connected', userData);
        // }
        setInitializing(false);
      }
    }

    initApp();
  }, [loading]);

  // Remove splashscreen when app is ready
  useEffect(() => {
    function showApp() {
      if (!initializing) {
        RNBootSplash.hide({fade: true});
      }
    }

    showApp();
  }, [initializing]);

  return (
    <Navigator
      initialRouteName={auth().currentUser ? 'Home' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
      }}>
      {auth().currentUser ? (
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
