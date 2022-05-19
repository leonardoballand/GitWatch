import * as React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {Button, Text} from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import appDistribution from '@react-native-firebase/app-distribution';
import {useNavigation} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

import {GQLRepository} from 'graphql/schema';
import {AppStackParamsList, GitWatchUser} from 'types';
import {CloseIcon} from 'components/Icons';
import AppHeader from 'components/AppHeader';

import styles from './index.style';
import useStore from 'store';

interface IProps {
  data: any;
  error: any;
  loading: boolean;
  userRepositories: GQLRepository[];
}

type Props = NativeStackScreenProps<AppStackParamsList, 'ManageAccountScreen'>;

type NavigationProps = Props['navigation'];

function ManageAccountScreen() {
  const {goBack} = useNavigation<NavigationProps>();
  const {user, setUser} = useStore(state => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const initialSnapPoints = React.useMemo(() => ['30%', 'CONTENT_HEIGHT'], []);

  const [errorMsg, setErrorMsg] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  const goToBack = () => goBack();

  /**
   * Set User data
   * Get data from user database
   */
  const setUserData = async () => {
    const userId = auth().currentUser?.uid;

    const userFirebaseData = await firestore()
      .collection('Users')
      .doc(userId)
      .get();

    const userData = userFirebaseData.data() as GitWatchUser;

    setUser(null, userData);
  };

  /**
   * Render header back button
   */
  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goToBack}>
        <CloseIcon />
      </TouchableOpacity>
    );
  };

  const onDeletePress = () => {
    bottomSheetRef.current?.expand();
  };

  const renderBackdrop = React.useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const removeAccount = async () => {
    try {
      setLoading(true);

      const userId = auth().currentUser?.uid;

      if (Platform.OS === 'ios') {
        await appDistribution().signOutTester();
      }

      await firestore().collection('Users').doc(userId).delete();
      await firestore().collection('Repositories').doc(userId).delete();
      await firestore().collection('Organizations').doc(userId).delete();
      await auth().currentUser?.delete();
      await auth().signOut();
    } catch (e) {
      if (String(e).includes('auth/requires-recent-login')) {
        await auth().signInWithEmailAndPassword(user?.email!, '123456789!');
        await auth().currentUser?.delete();
        await auth().signOut();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Ooooooops!',
          text2: 'Could not remove account. Try to sign-in again and retry.',
        });
      }
    } finally {
      bottomSheetRef.current?.forceClose();
      setLoading(false);
    }
  };

  // On mount
  React.useEffect(() => {
    setUserData();
  }, []);

  // Setup firestore listener for user data
  React.useEffect(() => {
    const userId = auth().currentUser?.uid;

    const subscriber = firestore()
      .collection('Users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        setUser(null, documentSnapshot.data() as GitWatchUser);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <>
      <AppHeader
        title="My account"
        description="More options available soon"
        level={4}
        accessoryLeft={renderBackAction}
      />

      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            marginHorizontal: 16,
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 48,
          }}>
          <TouchableOpacity
            onPress={onDeletePress}
            style={{alignSelf: 'center'}}>
            <Text category="s1" status="danger">
              I want to delete my account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        // add bottom inset to elevate the sheet
        bottomInset={24}
        enablePanDownToClose
        // set `detached` to true
        detached={true}
        style={{marginHorizontal: 24}}
        index={-1}
        backdropComponent={renderBackdrop}>
        <BottomSheetView
          onLayout={handleContentLayout}
          style={{
            position: 'relative',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <Text style={{marginBottom: 16}} category="h5">
            ⚠️
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text category="s1" style={{textAlign: 'center', marginBottom: 8}}>
              The following content will be deleted and cannot be reverted
            </Text>
            <Text category="c2">Account data</Text>
            <Text category="c2">Account settings</Text>
            <Text category="c2">Notifications</Text>
          </View>

          <View
            style={{
              alignSelf: 'stretch',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginVertical: 24,
            }}>
            <Button
              style={{borderRadius: 24}}
              status="basic"
              appearance="outline"
              onPress={closeBottomSheet}>
              Cancel
            </Button>
            <Button
              style={{borderRadius: 24}}
              status="danger"
              onPress={removeAccount}>
              I understand
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

export default ManageAccountScreen;
