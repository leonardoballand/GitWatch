import React from 'react';
import {Text} from '@ui-kitten/components';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './index.style';

interface IHeader {
  testID?: string;
  title: string;
  description?: string;
  level?: number;
  accessoryLeft?: () => React.ReactNode;
  accessoryRight?: () => React.ReactNode;
  color?: string;
}

const AppHeader = ({
  testID = 'AppHeader',
  title,
  description = '',
  level = 1,
  accessoryLeft = () => null,
  accessoryRight = () => null,
  color = 'white',
}: IHeader) => {
  return (
    <SafeAreaView
      testID={testID}
      style={styles.container(color)}
      edges={['top', 'left', 'right']}>
      <View testID={`${testID}-navigation`} style={styles.navigation}>
        <View>{accessoryLeft()}</View>
        <View>{accessoryRight()}</View>
      </View>

      <Text testID={`${testID}-title`} category={`h${level}`}>
        {title}
      </Text>

      {!!description && (
        <Text testID={`${testID}-description`} category="c1">
          {description}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default AppHeader;
