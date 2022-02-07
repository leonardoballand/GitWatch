import * as React from 'react';
import {Image} from 'react-native';
import {Button, Layout, Text, useTheme} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/core';
import {AppStackParamsList} from 'types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import getNativeAssetUri from 'utils/getNativeAssetUri';
import styles from './index.style';

type Props = NativeStackScreenProps<AppStackParamsList, 'Onboarding'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function OnboardingScreen() {
  const theme = useTheme();
  const {navigate} = useNavigation<NavigationProps>();

  const goToLogin = () => navigate('Login');

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-1']},
      ]}>
      <Layout
        level="1"
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          backgroundColor: 'transparent',
        }}>
        <Image
          style={{width: 100, height: 100, alignSelf: 'center'}}
          source={{uri: getNativeAssetUri('logo.png')}}
        />
      </Layout>
      <Layout level="1" style={styles.container}>
        <Layout level="1">
          <Text category="h5" status="basic" style={styles.title}>
            You can get the perfect overview of your repositories, right now.
          </Text>

          <Text category="s1" style={[styles.p, {color: theme['']}]}>
            To gain productivity every day, just one glance is enough to analyze
            current workflows. Don't wait any longer to become even better.
          </Text>

          <Button
            onPress={goToLogin}
            appearance="filled"
            status="info"
            size="giant">
            Getting Started
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
}

export default OnboardingScreen;
