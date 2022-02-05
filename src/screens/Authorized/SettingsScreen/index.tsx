import * as React from 'react';
import {Image, View, ScrollView, Platform} from 'react-native';
import {
  TopNavigationAction,
  Text,
  ListItem,
  Divider,
  Toggle,
} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import appDistribution, {
  FirebaseAppDistributionTypes,
} from '@react-native-firebase/app-distribution';
import {useUserData} from 'hooks/useUserData';
import {GitWatchUser, TabStackParamsList} from 'types';
import AppHeader from 'components/AppHeader';
import {NotificationsIcon} from 'components/Icons';

const LogoutIcon = (props: any) => (
  <Icon {...props} name="power-settings-new" size={24} />
);

const ChevronIcon = (props: any) => (
  <Icon {...props} name="chevron-right" size={24} />
);

const AccountIcon = (props: any) => (
  <Icon {...props} name="person" size={24} color="#2ecc71" />
);

const LocationIcon = (props: any) => (
  <Icon {...props} name="place" size={24} color="#3498db" />
);

const ManagerIcon = (props: any) => (
  <Icon {...props} name="admin-panel-settings" size={24} color="#9b59b6" />
);

const RepositoriesIcon = (props: any) => (
  <Icon {...props} name="backup" size={24} color="#e74c3c" />
);

const PrivacyIcon = (props: any) => (
  <Icon {...props} name="security" size={24} color="#34495e" />
);

const TermsIcon = (props: any) => (
  <Icon {...props} name="description" size={24} color="#7f8c8d" />
);

const HelpIcon = (props: any) => (
  <Icon {...props} name="support" size={24} color="#f39c12" />
);

type Props = NativeStackScreenProps<TabStackParamsList, 'Settings'>;

type NavigationProps = Props['navigation'];

function SettingsScreen() {
  const {navigate} = useNavigation<NavigationProps>();
  const {data, setUser} = useUserData<GitWatchUser>();

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => ['25%'], []);

  const [loading, setLoading] = React.useState(false);

  const [enableManagerMode, setEnableManagerMode] = React.useState(
    data?.managerMode,
  );

  const [appUpdatesEnabled, setAppUpdatesEnabled] = React.useState(false);

  const [appVersion, setAppVersion] =
    React.useState<FirebaseAppDistributionTypes.AppDistributionRelease>();

  const logout = async () => {
    await auth().signOut();
  };

  const goToSelectRepositories = () => navigate('SelectRepositories');

  const goToManageAccount = () => navigate('ManageAccount');

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

      await firestore().collection('Users').doc(data?.id).update({
        appUpdatesEnabled: updatesAlertEnabled,
      });
    } catch (e) {
      console.log('onAppUpdatesChange', e);
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
      .doc(data?.id)
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
            source={{uri: data!.avatarUrl as string}}
            style={{
              width: 75,
              height: 75,
              borderRadius: 75,
              borderWidth: 3,
              borderColor: 'white',
              backgroundColor: 'lightgrey',
            }}
          />

          <Text category="s1">{data?.login}</Text>
          <Text category="c1">{data?.email}</Text>
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
            description={data!.location ?? 'No location found'}
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
          disabled
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
