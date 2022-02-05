import React from 'react';
import {Text} from '@ui-kitten/components';
import {StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './index.style';

interface IHeader {
  title: string;
  description?: string;
  level?: number;
  accessoryLeft?: () => React.ReactNode;
  accessoryRight?: () => React.ReactNode;
  color?: string;
}

const AppHeader = ({
  title,
  description = '',
  level = 1,
  accessoryLeft = () => null,
  accessoryRight = () => null,
  color = 'white',
}: IHeader) => {
  return (
    <SafeAreaView
      style={styles.container(color)}
      edges={['top', 'left', 'right']}>
      <View style={styles.navigation}>
        <View>{accessoryLeft()}</View>
        <View>{accessoryRight()}</View>
      </View>
      <Text category={`h${level}`}>{title}</Text>
      <Text category="c1">{description}</Text>
    </SafeAreaView>
  );
};

export default AppHeader;
