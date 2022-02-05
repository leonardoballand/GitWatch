import React from 'react';
import {Text, useTheme} from '@ui-kitten/components';
import {View} from 'react-native';

import styles from './index.style';

interface ITag {
  color?: string;
  textColor?: string;
  children: string;
}

const Tag = ({color, textColor, children}: ITag) => {
  const theme = useTheme();

  return (
    <View style={styles.container(color ?? theme['color-primary-100'])}>
      <Text
        style={styles.label(textColor ?? theme['color-primary-500'])}
        category="label">
        {children.substring(0, 24)}
      </Text>
    </View>
  );
};

export default Tag;
