import * as React from 'react';
import {Image, View, ScrollView, Platform} from 'react-native';
import {
  TopNavigationAction,
  Text,
  ListItem,
  Divider,
  Toggle,
} from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import type {CompositeScreenProps} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import appDistribution, {
  FirebaseAppDistributionTypes,
} from '@react-native-firebase/app-distribution';
import {AppStackParamsList, TabStackParamsList} from 'types';
import AppHeader from 'components/AppHeader';
import {
  AboutIcon,
  AccountIcon,
  ChevronIcon,
  HelpIcon,
  LocationIcon,
  LogoutIcon,
  ManagerIcon,
  NotificationsIcon,
  PrivacyIcon,
  RepositoriesIcon,
  TermsIcon,
} from 'components/Icons';
import useStore from 'store';

type Props = CompositeScreenProps<
  NativeStackScreenProps<TabStackParamsList, 'Settings'>,
  NativeStackScreenProps<AppStackParamsList>
>;

type NavigationProps = Props['navigation'];

function SettingsScreen() {
  const {navigate} = useNavigation<NavigationProps>();
  const {user, setUser} = useStore(state => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ['25%'], []);

  const [loading, setLoading] = React.useState(false);

  const [enableManagerMode, setEnableManagerMode] = React.useState(
    user?.managerMode,
  );

  const [appUpdatesEnabled, setAppUpdatesEnabled] = React.useState(false);

  const [appVersion, setAppVersion] =
    React.useState<FirebaseAppDistributionTypes.AppDistributionRelease>();

  const logout = async () => {
    await auth().signOut();
  };

  const goToSelectRepositories = () => navigate('SelectRepositories');

  const goToManageAccount = () => navigate('ManageAccount');

  const goToFeedbacks = () => navigate('Feedbacks');

  const goToAbout = () => navigate('About');

  const renderRightActions = () => {
    return <TopNavigationAction icon={LogoutIcon} onPress={logout} />;
  };

  const onAppUpdatesChange = async (enabled: boolean) => {
    try {
      setLoading(true);
      setAppUpdatesEnabled(enabled);

      if (enabled) {
        await appDistribution().signInTester();
      } else {
        await appDistribution().signOutTester();
      }

      const updatesAlertEnabled = await appDistribution().isTesterSignedIn();
      setAppUpdatesEnabled(updatesAlertEnabled);

      await firestore().collection('Users').doc(user?.id).update({
        appUpdatesEnabled: updatesAlertEnabled,
      });
    } catch (e) {
      console.log('onAppUpdatesChange error', e);

      Toast.show({
        type: 'error',
        text1: 'Ooooooops',
        text2: `Could not ${
          enabled ? 'enable' : 'disabled'
        } app updates. Try again!`,
      });
    } finally {
      setLoading(false);
    }
  };

  const onManagerModeChange = (enabled: boolean) => {
    setLoading(true);
    setEnableManagerMode(enabled);

    // update Firestore user data
    firestore()
      .collection('Users')
      .doc(user?.id)
      .update({
        managerMode: enabled,
      })
      .then(() => {
        setUser('managerMode', enabled);
        setEnableManagerMode(enabled);
      })
      .catch(e => {
        setEnableManagerMode(false);
        console.error(e);

        Toast.show({
          type: 'error',
          text1: 'Ooooooops!',
          text2: `Could not ${
            enabled ? 'enable' : 'disable'
          } manager mode. Try again!`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderManagerToggle = () => {
    return (
      <Toggle checked={enableManagerMode} onChange={onManagerModeChange} />
    );
  };

  const renderAppUpdatesToggle = () => {
    return <Toggle checked={appUpdatesEnabled} onChange={onAppUpdatesChange} />;
  };

  const renderAppUpdatesDescription = () => {
    if (appUpdatesEnabled) {
      if (!!appVersion && appVersion.isExpired) {
        return `New version ${appVersion.displayVersion}-${appVersion.buildVersion} available`;
      } else {
        return 'Already up-to-date!';
      }
    } else {
      return 'Get latest version alerts';
    }
  };

  const checkUpdates = async () => {
    if (Platform.OS === 'ios') {
      const updateAlertsEnabled = await appDistribution().isTesterSignedIn();
      setAppUpdatesEnabled(updateAlertsEnabled);

      if (updateAlertsEnabled) {
        const appVersionData = await appDistribution().checkForUpdate();
        setAppVersion(appVersionData);
      }
    }
  };

  const renderBackdrop = React.useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        pressBehavior="none"
      />
    ),
    [],
  );

  React.useEffect(() => {
    checkUpdates();
  }, [appUpdatesEnabled]);

  React.useEffect(() => {
    function showLoadingBottomSheet() {
      if (loading) {
        bottomSheetRef.current?.expand();
      } else {
        setTimeout(() => {
          bottomSheetRef.current?.forceClose();
        }, 500);
      }
    }

    showLoadingBottomSheet();
  }, [loading]);

  return (
    <>
      <AppHeader
        title="Settings"
        level={2}
        accessoryRight={renderRightActions}
      />
      <ScrollView
        style={{backgroundColor: '#ffffff'}}
        contentContainerStyle={{backgroundColor: '#f8f8f8'}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 24,
          }}>
          <Image
            source={{uri: user!.avatarUrl as string}}
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              borderWidth: 3,
              borderColor: 'white',
              backgroundColor: 'lightgrey',
            }}
          />

          <Text category="s1">{user?.login}</Text>
          <Text category="c1">{user?.email}</Text>
        </View>

        <View>
          <Text
            style={{marginHorizontal: 16, marginBottom: 16, color: 'darkgrey'}}
            category="label">
            ACCOUNT
          </Text>

          <ListItem
            title="Manage account"
            accessoryLeft={AccountIcon}
            accessoryRight={ChevronIcon}
            onPress={goToManageAccount}
          />
          <Divider />
          <ListItem
            title="Your location"
            description={user!.location ?? 'No location found'}
            accessoryLeft={LocationIcon}
            // accessoryRight={ChevronIcon}
            disabled
          />
          <Divider />
          <ListItem
            title="Manager mode"
            description="View data as a manager"
            accessoryLeft={ManagerIcon}
            accessoryRight={renderManagerToggle}
            disabled
          />
          <Divider />
          <ListItem
            title="Manage repositories"
            accessoryLeft={RepositoriesIcon}
            accessoryRight={ChevronIcon}
            onPress={goToSelectRepositories}
          />
          {Platform.OS === 'ios' && (
            <>
              <Divider />
              <ListItem
                title="Check for app updates"
                description={renderAppUpdatesDescription()}
                accessoryLeft={NotificationsIcon}
                accessoryRight={renderAppUpdatesToggle}
                disabled
              />
            </>
          )}
        </View>

        <Text
          style={{marginHorizontal: 16, marginVertical: 16, color: 'darkgrey'}}
          category="label">
          OTHER
        </Text>

        <Divider />
        <ListItem
          title="About"
          accessoryLeft={AboutIcon}
          accessoryRight={ChevronIcon}
          onPress={goToAbout}
        />
        <ListItem
          title="Privacy policy"
          accessoryLeft={PrivacyIcon}
          // accessoryRight={ChevronIcon}
          disabled
        />
        <Divider />
        <ListItem
          title="Terms"
          accessoryLeft={TermsIcon}
          // accessoryRight={ChevronIcon}
          disabled
        />
        <Divider />
        <ListItem
          title="Help & feedback"
          accessoryLeft={HelpIcon}
          // accessoryRight={ChevronIcon}
          onPress={goToFeedbacks}
        />

        <Text
          style={{marginHorizontal: 16, marginVertical: 16, color: 'darkgrey'}}
          category="label"
        />
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        // add bottom inset to elevate the sheet
        bottomInset={24}
        // set `detached` to true
        detached={true}
        style={{marginHorizontal: 24}}
        index={-1}
        backdropComponent={renderBackdrop}>
        <View
          style={{
            position: 'relative',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LottieView
            style={{
              height: 250,
            }}
            source={require('../../../78259-loading.json')}
            autoPlay
            loop
          />
        </View>
      </BottomSheet>
    </>
  );
}

export default SettingsScreen;
