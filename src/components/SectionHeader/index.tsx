import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';

import styles from './index.style';

interface ISectionHeader {
  icon: JSX.Element;
  title: string;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
  rightActionDisabled?: boolean;
}

const SectionHeader = ({
  icon,
  title,
  rightActionLabel,
  onRightActionPress = () => {},
  rightActionDisabled = false,
}: ISectionHeader) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.title} category="label">
          {title}
        </Text>
      </View>

      {rightActionLabel && (
        <TouchableOpacity
          disabled={rightActionDisabled}
          onPress={onRightActionPress}>
          <Text
            style={styles.label(
              rightActionDisabled
                ? theme['color-basic-500']
                : theme['color-primary-100'],
            )}
            category="c2">
            {rightActionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
