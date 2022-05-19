import * as React from 'react';
import {
  Button,
  Layout,
  Icon,
  useTheme,
  Modal,
  Text,
  Input,
} from '@ui-kitten/components';
import {Linking, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {config} from 'utils/OAuthManager';
import getUserIssues from 'api/github/getUserIssues';
import getUserData from 'api/github/getUserData';
import {GQLIssue, GQLRepository, GQLUser} from 'graphql/schema';
import {AppStackParamsList, GitWatchUser} from 'types';
import styles from './index.style';
import useStore from 'store';

const GithubIcon = (props: any) => <Icon {...props} name="github" />;

type Props = NativeStackScreenProps<AppStackParamsList, 'Login'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function LoginScreen() {
  const theme = useTheme();
  const {params} = useRoute<RouteProps>();
  const {userData, setUser} = useStore(state => ({
    userData: state.user,
    setUser: state.setUser,
  }));

  let state = 'Fytymlk567888dqs6575432fdfdfg!!!';

  const [loading, setLoading] = React.useState(false);
  const [codeReceived, setCodeReceived] = React.useState(false);
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [viewer, setViewer] = React.useState<GQLUser | null>(null);

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

  // Extract user active repositories
  const getEstimatedRepositories = (issues: GQLIssue[]) => {
    const repositories: string[] = [];
    const repositoriesData = [];

    issues.forEach(issue => {
      const {name: repositoryName} = issue.repository;

      if (!repositories.includes(repositoryName)) {
        repositories.push(repositoryName);
        repositoriesData.push(issue.repository);
      }
    });

    return repositoriesData;
  };

  // Extract user active organizations
  const getEstimatedOrganizations = (issues: GQLIssue[]) => {
    const organizations: string[] = [];

    issues.forEach(issue => {
      const {
        owner: {login: organizationName},
      } = issue.repository;

      if (!organizations.includes(organizationName)) {
        organizations.push(organizationName);
      }
    });

    return organizations;
  };

  // Create current user suggested repositories in DB
  const createUserRepositories = async (
    userId: string,
    repositories: GQLRepository[],
  ) => {
    await firestore().collection('Repositories').doc(userId).set({
      suggested: repositories,
    });
  };

  // Create current user suggested organizations in DB
  const createUserOrganizations = async (
    userId: string,
    organizations: string[],
  ) => {
    await firestore().collection('Organizations').doc(userId).set({
      suggested: organizations,
    });
  };

  // Create current user data
  const createUserData = async (data: GitWatchUser) => {
    try {
      await firestore().collection('Users').doc(data.id).set(data);
    } catch (e) {
      console.log('createUserData error', e);
    }
  };

  const onButtonPress = () => {
    setLoading(true);

    Linking.openURL(
      encodeURI(
        `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUrl}&scope=identity,repo,user,read:org&state=${state}&allow_signup=false`,
      ),
    );
  };

  const onChangeText = (value: string) => setEmail(value);

  const isEmailValid = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,9})+$/.test(email)) {
      return true;
    }

    return false;
  };

  const onContinuePress = async () => {
    setLoading(true);
    // Initialize Firebase auth user
    const user = await initializeFirebaseUser(email);

    const [firstName, lastName] = viewer?.name!.split(' ') ?? ['', ''];

    let userInformations = {
      id: user?.id,
      email,
      avatarUrl: viewer?.avatarUrl,
      login: viewer?.login,
      name: viewer?.login,
      firstName,
      lastName,
    };

    // When user just signed-up
    // - Get data suggestions
    // - Show initial app configuration screen
    if (user?.isNewUser) {
      try {
        const userIssues = await getUserIssues(viewer?.login!);

        let estimatedRepositories = [];
        let estimatedOrganizations: Array<string> = [];

        if (userIssues.length) {
          estimatedRepositories = getEstimatedRepositories(userIssues);
          await createUserRepositories(user.id, estimatedRepositories);

          estimatedOrganizations = getEstimatedOrganizations(userIssues);
          await createUserOrganizations(user.id, estimatedOrganizations);
        }

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
      } catch (e) {
        console.log('onContinuePress error', e);
      }
    } else {
      // Restore user data from Firestore
      const firestoreUser = await firestore()
        .collection('Users')
        .doc(user?.id)
        .get();

      setUser(null, {...userInformations, ...firestoreUser.data()});
    }
  };

  const onCodeReceived = async () => {
    if (loading && params?.code) {
      if (params?.state === state) {
        try {
          // send post to get access token
          const res = await fetch(
            `https://github.com/login/oauth/access_token?client_id=${config.clientId}&client_secret=${config.clientSecret}&code=${params?.code}`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
              },
            },
          );

          if (res.status === 200) {
            const githubLoginData = await res.json();
            setUser('accessToken', githubLoginData.access_token);
            setLoading(false);
            setCodeReceived(true);
          } else {
            setLoading(false);
            console.log('error with login', params, res.status);
          }
        } catch (e) {
          console.log('onCodeReceived error', e);
        }
      }
    }
  };

  React.useEffect(() => {
    async function init() {
      if (userData && userData.accessToken && !error) {
        // Get Github viewer data
        const viewerData = await getUserData();

        if (!viewerData.email) {
          setViewer(viewer);
          setError('email-missing');
          setLoading(false);
          setCodeReceived(true);
          return;
        }

        // Initialize Firebase auth user
        const user = await initializeFirebaseUser(viewerData.email);
        const [firstName, lastName] = viewerData?.name!.split(' ') ?? ['', ''];

        let userInformations: GitWatchUser = {
          id: user?.id as string,
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
        if (user?.isNewUser) {
          try {
            const userIssues = await getUserIssues(viewerData.login);
            let estimatedRepositories = [];
            let estimatedOrganizations: Array<string> = [];

            if (userIssues.length) {
              estimatedRepositories = getEstimatedRepositories(userIssues);
              await createUserRepositories(user.id, estimatedRepositories);

              estimatedOrganizations = getEstimatedOrganizations(userIssues);
              await createUserOrganizations(user.id, estimatedOrganizations);
            }

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
          } catch (e) {
            console.log('onLogin error', e);
          }
        } else {
          // Restore user data from Firestore
          const firestoreUser = await firestore()
            .collection('Users')
            .doc(user?.id)
            .get();

          setUser(null, {...userInformations, ...firestoreUser.data()});
        }
      }

      setLoading(false);
    }

    init();
  }, [userData]);

  React.useEffect(() => {
    function waitForCode() {
      if (!codeReceived) {
        onCodeReceived();
      }
    }

    waitForCode();
  }, [params?.code]);

  return (
    <SafeAreaView
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-1']},
      ]}>
      <Layout level="1" style={styles.container}>
        <Button
          status="basic"
          appearance="filled"
          accessoryLeft={GithubIcon}
          disabled={!!error}
          onPress={onButtonPress}>
          {loading && !viewer ? 'Loading...' : 'Sign-in with Github'}
        </Button>

        <Modal
          visible={error === 'email-missing'}
          backdropStyle={styles.backdrop}>
          <View
            style={{
              backgroundColor: 'white',
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}>
            <Text style={{marginBottom: 8}} category="h5">
              One more little thing...
            </Text>

            <Text category="s1">
              Unfortunatly, your Github account did not provide any public
              email.
            </Text>

            <Input
              style={{marginVertical: 24, marginHorizontal: 8}}
              textStyle={{}}
              size="small"
              onChangeText={onChangeText}
              label={evaProps => (
                <Text {...evaProps}>
                  What email should GitWatch know you by?
                </Text>
              )}
              caption={evaProps => (
                <Text {...evaProps}>
                  Your email won't be our preferred target for spam
                </Text>
              )}
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
              keyboardType="email-address"
              value={email}
            />

            <Button
              status="basic"
              appearance="filled"
              disabled={!isEmailValid()}
              onPress={onContinuePress}>
              {loading ? 'Loading...' : 'Continue'}
            </Button>
          </View>
        </Modal>
      </Layout>
    </SafeAreaView>
  );
}

export default LoginScreen;
