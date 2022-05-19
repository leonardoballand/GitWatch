import * as React from 'react';
import {Dimensions, Image, Linking} from 'react-native';
import {Layout, Text, useTheme, Modal, Card} from '@ui-kitten/components';
import {useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import getNativeAssetUri from 'utils/getNativeAssetUri';
import {config} from 'utils/OAuthManager';
import getUserIssues from 'api/github/getUserIssues';
import getUserData from 'api/github/getUserData';
import Button from 'components/Button';
import useStore from 'store';
import type {GQLRepository, GQLUser} from 'graphql/schema';
import type {AppStackParamsList, GitWatchUser} from 'types';
import styles from './index.style';
import getUserCredentials from 'api/github/getUserCredentials';
import initializeFirebaseUser from 'utils/firebase/initializeFirebaseUser';
import getEstimatedRepositories from 'utils/github/getEstimatedRepositories';
import createUserRepositories from 'utils/firebase/createUserRepositories';
import getEstimatedOrganizations from 'utils/github/getEstimatedOrganizations';
import createUserOrganizations from 'utils/firebase/createUserOrganizations';
import createUserData from 'utils/firebase/createUserData';

type Props = NativeStackScreenProps<AppStackParamsList, 'Onboarding'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

let GITHUB_STATE = 'Fytymlk567888dqs6575432fdfdfg!!!';

function OnboardingScreen() {
  const theme = useTheme();
  const {params} = useRoute<RouteProps>();
  const {user, setUser} = useStore(state => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const [loading, setLoading] = React.useState(false);
  const [codeReceived, setCodeReceived] = React.useState(false);
  const [error, setError] = React.useState<
    'email-missing' | 'incorrect-name' | ''
  >('');
  const [viewer, setViewer] = React.useState<GQLUser | null>(null);

  // Open Github login in webview
  const goToGithubLogin = React.useCallback(() => {
    setLoading(true);

    Linking.openURL(
      encodeURI(
        `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUrl}&scope=identity,repo,user,read:org&state=${GITHUB_STATE}&allow_signup=false`,
      ),
    );
  }, []);

  // Open Github user profile settings in webview
  const goToGithubSettings = React.useCallback(() => {
    Linking.openURL('https://github.com/settings/profile');
    setError('');
  }, []);

  // When app receives code from deeplinking
  // Get Github credentials to get user access token
  const onCodeReceived = async () => {
    if (loading && params?.code) {
      if (params?.state === GITHUB_STATE) {
        try {
          const credentials = await getUserCredentials(params.code);

          if (credentials) {
            setUser('accessToken', credentials.access_token);
            setLoading(false);
            setCodeReceived(true);
          } else {
            setLoading(false);
            console.log('error getting credentials', params);
          }
        } catch (e) {
          console.log('onCodeReceived error', e);

          Toast.show({
            type: 'error',
            text1: 'Oooooops!',
            text2:
              'Could not retrieve Github credentials. Try to sign-in again!',
          });
        }
      }
    }
  };

  // Initialize user when we got Github credentials
  const initUserAppData = async () => {
    if (user && user.accessToken && !error) {
      try {
        // Get Github viewer data
        const viewerData = await getUserData();
        console.log('viewer', viewer);

        if (!viewerData.email) {
          setViewer(viewer);
          setError('email-missing');
          setLoading(false);
          setCodeReceived(true);
          return;
        }

        if (!viewerData.name || viewerData.name.split(' ').length < 2) {
          setViewer(viewer);
          setError('incorrect-name');
          setLoading(false);
          setCodeReceived(true);
          return;
        }

        // Initialize Firebase auth user
        const userData = await initializeFirebaseUser(viewerData.email);
        const [firstName, lastName] = viewerData?.name!.split(' ') ?? ['', ''];

        let userInformations: GitWatchUser = {
          id: userData?.id as string,
          avatarUrl: viewerData.avatarUrl,
          email: viewerData.email,
          login: viewerData.login,
          location: viewerData.location,
          company: viewerData.company,
          name: viewerData.name as string,
          firstName,
          lastName,
        };

        // When user just signed-up
        // - Get data suggestions
        // - Show initial app configuration screen
        if (userData?.isNewUser) {
          try {
            const userIssues = await getUserIssues(viewerData.login);
            let estimatedRepositories: GQLRepository[] = [];
            let estimatedOrganizations: Array<string> = [];

            if (userIssues.length) {
              // Get repositories suggestions and save them in Firestore
              estimatedRepositories = getEstimatedRepositories(userIssues);
              await createUserRepositories(userData.id, estimatedRepositories);

              // Get organizations suggestions and save them in Firestore
              estimatedOrganizations = getEstimatedOrganizations(userIssues);
              await createUserOrganizations(
                userData.id,
                estimatedOrganizations,
              );
            }

            // Save user data in Firestore
            await createUserData(userInformations);

            setUser(null, {
              ...userInformations,
              isNewUser: true,
              repositories: {
                suggested: estimatedRepositories,
              },
              organizations: {
                suggested: estimatedOrganizations,
              },
            });
          } catch (err) {
            console.log('onLogin error', err);
          }
        } else {
          // Restore user data from Firestore
          const firestoreUser = await firestore()
            .collection('Users')
            .doc(user?.id)
            .get();

          setUser(null, {...userInformations, ...firestoreUser.data()});
        }
      } catch (e) {
        console.log('e', e.source);

        Toast.show({
          type: 'error',
          text1: 'Oooooops!',
          text2:
            'Sorry but something gone wrong. Please do report to developers team.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // When user get access token
  // Log user in Firebase, get Github viewer data and prepare user app data
  React.useEffect(() => {
    initUserAppData();
  }, [user?.accessToken]);

  // Detect Github credentials deeplinking
  React.useEffect(() => {
    function waitForCode() {
      if (!codeReceived) {
        console.log('ue:code received', codeReceived, params?.code);
        onCodeReceived();
      }
    }

    console.log('params', params);

    waitForCode();
  }, [params?.code]);

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-1']},
      ]}>
      <Image
        style={{
          resizeMode: 'contain',
          width: 215,
          height: 39,
          alignSelf: 'center',
        }}
        source={{uri: getNativeAssetUri('GitWatch.png')}}
      />

      <Image
        style={{
          position: 'absolute',
          top: Dimensions.get('screen').height / 2 - 190,
          left: 0,
          right: 0,
          alignSelf: 'center',
          width: Dimensions.get('screen').width,
          height: 380,
        }}
        source={{uri: getNativeAssetUri('onboard_background.png')}}
      />

      <Layout level="1" style={styles.container}>
        <Text category="h5" status="basic" style={styles.title}>
          You can get the perfect overview of your repositories, right now.
        </Text>

        <Text category="s1" style={[styles.p, {color: theme['']}]}>
          To gain productivity every day, just one glance is enough to analyze
          current workflows.
        </Text>

        <Button
          onPress={goToGithubLogin}
          disabled={loading}
          appearance="filled"
          status="info"
          size="medium">
          {loading ? 'Loading account...' : 'Connect Github'}
        </Button>

        <Modal
          visible={!!error}
          backdropStyle={styles.backdrop}
          // </SafeAreaView>onBackdropPress = {() => setVisible(false)}
        >
          <Card disabled={true}>
            <Text style={styles.modalTitle}>Ooooops!</Text>
            <Text style={styles.modalText}>
              It appears that{' '}
              {error === 'email-missing'
                ? 'your email is missing'
                : 'your name is missing or do not contain firstname/lastname'}
              {'.'}
            </Text>
            <Text style={styles.modalText}>
              In order to avoid bad user experience, you should complete your
              Github profile informations. Please try again when you've updated
              it.
            </Text>
            <Button style={styles.modalButton} onPress={goToGithubSettings}>
              Update settings
            </Button>
          </Card>
        </Modal>
      </Layout>
    </SafeAreaView>
  );
}

export default OnboardingScreen;
