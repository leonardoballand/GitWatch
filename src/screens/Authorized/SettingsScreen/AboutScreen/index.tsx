import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Divider, ListItem} from '@ui-kitten/components';
import BuildConfig from 'react-native-build-config';

import {AppStackParamsList} from 'types';
import {BackIcon} from 'components/Icons';
import AppHeader from 'components/AppHeader';

import styles from './index.style';

interface IProps {}

type Props = NativeStackScreenProps<AppStackParamsList, 'About'>;

type NavigationProps = Props['navigation'];

function AboutScreen() {
  const {goBack} = useNavigation<NavigationProps>();

  const goToBack = () => goBack();

  /**
   * Render header back button
   */
  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goToBack}>
        <BackIcon />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppHeader
        title="About"
        description="Application data"
        level={4}
        accessoryLeft={renderBackAction}
      />

      <View style={styles.container}>
        <ListItem
          title="Version name"
          description={BuildConfig.VERSION_NAME}
          disabled
        />
        <Divider />
        <ListItem
          title="Build number"
          description={BuildConfig.VERSION_CODE}
          disabled
        />
        <Divider />
      </View>
    </>
  );
}

export default AboutScreen;
