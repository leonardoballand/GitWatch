import React, {useState} from 'react';
import {View, Image} from 'react-native';
import {Button, Text} from '@ui-kitten/components';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AppHeader from 'components/AppHeader';
import {Week5StackParamsList} from 'types';
import styles from './index.style';

type Props = NativeStackScreenProps<Week5StackParamsList, 'Week5Home'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function Week5HomeScreen() {
  const {navigate} = useNavigation<NavigationProps>();

  const [appSettings, setAppSettings] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined
  >(null);

  const goToSelectMembers = () => navigate('Week5SelectMembers');

  // Firestore listener for app settings
  React.useEffect(() => {
    const subscriber = firestore()
      .collection('App')
      .doc('settings')
      .onSnapshot(documentSnapshot => {
        setAppSettings(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <>
      <AppHeader title="Week5" level={2} />

      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Image
            style={{height: 200, width: 200, marginBottom: 24}}
            source={{
              uri: 'data:image/png;base64,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',
            }}
          />
          <Text category="h4">Get ready...</Text>
          <Text category="c1">Next Week5 is coming!</Text>
        </View>

        <Button
          disabled={!appSettings?.week5enabled}
          onPress={goToSelectMembers}>
          {appSettings?.week5enabled ? 'Create Week5 Squad' : 'Coming soon'}
        </Button>
      </View>
    </>
  );
}

export default Week5HomeScreen;
