import React, {useEffect, useState} from 'react';
import {View, Image, ScrollView, Platform, FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {Toggle, Text, Button, Spinner, CheckBox} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import appDistribution from '@react-native-firebase/app-distribution';
import messaging from '@react-native-firebase/messaging';
import {AppStackParamsList} from 'types';
import useToggleStates from 'hooks/useToggleStates';
import {GQLRepository} from 'graphql/schema';
import {ActionCompletedIcon} from 'components/Icons';

import styles from './index.style';
import useStore from 'store';

type Slide = {
  key:
    | 'organizations'
    | 'repositories'
    | 'managerMode'
    | 'permissions'
    | 'ready';
  title: string;
  text: string;
  image: string;
  backgroundColor: string;
};

const slides: Slide[] = [
  {
    key: 'organizations',
    title: 'Configure organizations',
    text: 'We think that you are working at organizations below.\nEnable which ones you belong to.',
    image:
      'https://image.freepik.com/free-vector/organization-flat-icon_1262-18775.jpg',
    backgroundColor: '#ffffff',
  },
  {
    key: 'repositories',
    title: 'Configure repositories',
    text: 'Find out some suggested repositories. Enable which ones you are working on.',
    image:
      'https://lh3.googleusercontent.com/_4io-xh1zBYsBQpEqakIXH1OKDgZWrdzike-_c1t2fW7mQdLAY94t98sdK0kL16hNvQt5XFOzBrM=e14-h470-w1200',
    backgroundColor: '#ffffff',
  },
  {
    key: 'managerMode',
    title: 'Configure role',
    text: "GitWatch meets your needs. Tell us what awesome job you got so we won't display useless data!",
    image:
      'https://i.ibb.co/p1CNnwp/kisspng-project-management-body-of-knowledge-project-manag-5b0d5f35941ab8-0372962215276029976067.png',
    backgroundColor: '#ffffff',
  },
  {
    key: 'permissions',
    title: 'Configure permissions',
    text: 'We need you to enable certain permissions to provide you with the best features',
    image:
      'https://hs-marketing.imgix.net/images/uploads/advanced-permissions.png?ixlib=gatsbyHook-1.7.0&fit=min&auto=format%2Ccompress&placeholder=dominantColor&w=1247&h=701',
    backgroundColor: '#ffffff',
  },
  {
    key: 'ready',
    title: 'Account ready',
    text: 'Congrats, your account is now ready!',
    image:
      'https://image.freepik.com/free-vector/business-leader-standing-arrow-holding-flag-flat-vector-illustration-cartoon-people-training-doing-business-plan-leadership-victory-challenge-concept_74855-9812.jpg',
    backgroundColor: '#ffffff',
  },
];

type Props = NativeStackScreenProps<AppStackParamsList, 'Configuration'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function ConfigurationScreen() {
  const {params} = useRoute<RouteProps>();
  const {goBack} = useNavigation<NavigationProps>();
  const {user, setUser} = useStore(state => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const initialRepositories: {[key: string]: boolean} = {};

  params.repositories.forEach(
    repository => (initialRepositories[repository.name] = false),
  );

  const initialOrganizations: {[key: string]: boolean} = {};

  params.organizations.forEach(
    organization => (initialOrganizations[organization] = false),
  );

  const [loading, setLoading] = useState(false);
  const organizationsToggles = useToggleStates(initialOrganizations);
  const repositoriesToggles = useToggleStates(initialRepositories);

  const roleToggles = useToggleStates(
    {
      'organization owner': false,
      'product owner': false,
      'project manager': false,
      'technical lead': false,
      developer: true,
    },
    {
      single: true,
    },
  );

  const permissionsToggles = useToggleStates({
    appUpdatesEnabled: false,
    notifications: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const enableAppUpdates = async () => {
    try {
      const userSigned = await appDistribution().isTesterSignedIn();

      if (userSigned) {
        permissionsToggles.onChange('appUpdatesEnabled', true);
        await firestore().collection('Users').doc(user?.id).update({
          appUpdatesEnabled: true,
        });
      } else {
        await appDistribution().signInTester();
        await firestore().collection('Users').doc(user?.id).update({
          appUpdatesEnabled: true,
        });
      }
    } catch (e) {
      console.log('enableAppUpdates error', e);

      Toast.show({
        type: 'error',
        text1: 'Ooooops!',
        text2: 'Could not enable app updates. Try again!',
      });
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    await firestore().collection('Users').doc(user?.id).update({
      notifications: enabled,
    });
  };

  const renderSimpleScreen = (item: Slide) => {
    return (
      <ScrollView
        style={{flexGrow: 1}}
        contentContainerStyle={styles.slide}
        alwaysBounceVertical={false}>
        <Image style={styles.image} source={{uri: item.image}} />

        <View style={{marginHorizontal: 16}}>
          <Text category="h4" style={styles.title}>
            {item.title}
          </Text>
          <Text category="s2" style={styles.text}>
            {item.text}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: 16,
          }}>
          {Object.keys(roleToggles.checked).map(key => (
            <CheckBox
              key={key.replace(' ', '')}
              style={{marginBottom: 16}}
              checked={roleToggles.checked[key]}
              onChange={nextChecked => {
                roleToggles.onChange(key, nextChecked);
              }}>
              {key}
            </CheckBox>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderPermissionsScreen = (item: Slide) => {
    return (
      <ScrollView
        style={{flexGrow: 1}}
        contentContainerStyle={styles.slide}
        alwaysBounceVertical={false}>
        <Image style={styles.image} source={{uri: item.image}} />

        <View style={{marginHorizontal: 16}}>
          <Text category="h4" style={styles.title}>
            {item.title}
          </Text>
          <Text category="s2" style={styles.text}>
            {item.text}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: 16,
          }}>
          <View>
            {Platform.OS === 'ios' && (
              <Button
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
                status={
                  permissionsToggles.checked.appUpdatesEnabled
                    ? 'basic'
                    : 'primary'
                }
                disabled={permissionsToggles.checked.appUpdatesEnabled}
                accessoryRight={
                  permissionsToggles.checked.appUpdatesEnabled
                    ? () => <ActionCompletedIcon />
                    : undefined
                }
                onPress={enableAppUpdates}>
                {permissionsToggles.checked.appUpdatesEnabled
                  ? 'App updates enabled'
                  : 'Enable app updates'}
              </Button>
            )}

            <Button
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
              status={
                permissionsToggles.checked.notifications ? 'basic' : 'primary'
              }
              disabled={permissionsToggles.checked.notifications}
              accessoryRight={
                permissionsToggles.checked.notifications
                  ? () => <ActionCompletedIcon />
                  : undefined
              }
              onPress={requestUserPermission}>
              {permissionsToggles.checked.notifications
                ? 'Notifications enabled'
                : 'Enable notifications'}
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderStickyHeader = (item: Slide) => {
    return (
      <View style={{marginBottom: 16, backgroundColor: 'white'}}>
        <Image style={styles.image} source={{uri: item.image}} />

        <View style={{marginHorizontal: 16}}>
          <Text category="h4" style={styles.title}>
            {item.title}
          </Text>
          <Text category="s2" style={styles.text}>
            {item.text}
          </Text>
        </View>

        {item.key === 'repositories' && (
          <Button size="tiny" onPress={repositoriesToggles.toggleCheck}>
            {repositoriesToggles.allChecked ? 'Unselect All' : 'Select All'}
          </Button>
        )}

        {item.key === 'organizations' && (
          <Button size="tiny" onPress={organizationsToggles.toggleCheck}>
            {organizationsToggles.allChecked ? 'Unselect All' : 'Select All'}
          </Button>
        )}
      </View>
    );
  };

  const renderPickListItem = (
    slide: string,
    item: GQLRepository[] | string[],
  ) => {
    if (slide === 'repositories') {
      return (
        <Toggle
          key={item.id}
          style={styles.toggle}
          status="primary"
          checked={repositoriesToggles.checked[item.name]}
          onChange={checked =>
            repositoriesToggles.onChange(item.name, checked)
          }>
          <Text>{item.name}</Text>
        </Toggle>
      );
    }

    if (slide === 'organizations') {
      return (
        <Toggle
          key={item}
          style={styles.toggle}
          status="primary"
          checked={organizationsToggles.checked[item]}
          onChange={checked => organizationsToggles.onChange(item, checked)}>
          {String(item).toUpperCase()}
        </Toggle>
      );
    }

    return null;
  };

  const renderPickList = (
    item: Slide,
    pickItems: GQLRepository[] | string[],
  ) => {
    return (
      <FlatList
        style={{flex: 1, backgroundColor: 'white'}}
        contentContainerStyle={styles.slide}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => renderStickyHeader(item)}
        data={pickItems}
        extraData={item}
        renderItem={({item: listItem}) =>
          renderPickListItem(item.key, listItem)
        }
        stickyHeaderIndices={[0]}
      />
    );
  };

  const renderItem = ({item}: {item: Slide}) => {
    if (['organizations', 'repositories'].includes(item.key)) {
      return renderPickList(item, params[item.key]);
    }

    if (['managerMode'].includes(item.key)) {
      return renderSimpleScreen(item);
    }

    if (['permissions'].includes(item.key)) {
      return renderPermissionsScreen(item);
    }

    return (
      <ScrollView contentContainerStyle={styles.slide}>
        <Image style={styles.image} source={{uri: item.image}} />
        <Text category="h1" status="success">
          {item.title}
        </Text>
        <Text category="s1">{item.text}</Text>
      </ScrollView>
    );
  };

  const renderPrevButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="chevron-left" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="chevron-right" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        {loading ? (
          <Spinner size="tiny" status="primary" />
        ) : (
          <Icon name="check-circle" color="rgba(255, 255, 255, .9)" size={24} />
        )}
      </View>
    );
  };

  const onDone = async () => {
    try {
      setLoading(true);

      const userId = auth().currentUser?.uid;
      const selectedRepositories = Object.keys(
        repositoriesToggles.checked,
      ).filter(repository => !!repositoriesToggles.checked[repository]);

      const repositories = params.repositories.filter(repository =>
        selectedRepositories.includes(repository.name),
      );

      const organizations = Object.keys(organizationsToggles.checked).filter(
        organization => !!organizationsToggles.checked[organization],
      );

      const [role] = Object.keys(roleToggles.checked).filter(
        role => !!roleToggles.checked[role],
      );

      const managerModeEnabled = [
        'organization owner',
        'product owner',
        'project manager',
        'technical lead',
      ].includes(role);

      console.log('userid', userId);

      // update firestore
      await firestore().collection('Repositories').doc(userId).update({
        repositories,
      });

      await firestore().collection('Organizations').doc(userId).update({
        organizations,
      });

      await firestore().collection('Users').doc(userId).update({
        role,
        managerMode: managerModeEnabled,
      });

      setUser(null, {
        managerMode: managerModeEnabled,
        role,
        isNewUser: false,
      });

      goBack();
    } catch (e) {
      // error => display toast
      console.error('Configuration error', e.code, e.message);

      if (e.code.includes('firestore/not-found')) {
        Toast.show({
          type: 'error',
          text1: 'Ooooops!',
          text2:
            'Sorry, it seems like something gone wrong. Please retry to sign-in!',
        });
        auth().signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  const onSlideChange = (index: number) => {
    setCurrentIndex(index);
  };

  const getInitialIndex = () => {
    if (params.organizations.length) {
      return 0;
    } else if (params.repositories.length) {
      return 1;
    } else {
      return 2;
    }
  };

  const showPrevButton = () => {
    if (params.organizations.length && currentIndex > 0) {
      return true;
    } else if (params.repositories.length && currentIndex > 1) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const userId = auth().currentUser?.uid;

    const subscriber = firestore()
      .collection('Users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        if (Platform.OS === 'ios') {
          permissionsToggles.onChange(
            'appUpdatesEnabled',
            documentSnapshot?.data()?.appUpdatesEnabled ?? false,
          );
        }

        permissionsToggles.onChange(
          'notifications',
          documentSnapshot?.data()?.notifications ?? false,
        );
      });

    async function checkNotificationsPermission() {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        await firestore().collection('Users').doc(userId).update({
          notifications: enabled,
        });
      }
    }

    checkNotificationsPermission();

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <AppIntroSlider
      scrollEnabled={false}
      initialScrollIndex={getInitialIndex()}
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      onSlideChange={onSlideChange}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      showPrevButton={showPrevButton}
      dotStyle={{display: 'none', backgroundColor: 'transparent'}}
    />
  );
}

export default ConfigurationScreen;
