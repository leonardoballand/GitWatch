import React from 'react';
import {TouchableOpacity, View, Animated} from 'react-native';
import type {ViewStyle} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';

import styles from './index.style';

interface ISectionHeader {
  style: ViewStyle;
  icon: JSX.Element;
  title: string;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
  rightActionDisabled?: boolean;
}

const SectionHeader = ({
  style = {},
  icon,
  title,
  rightActionLabel,
  onRightActionPress = () => {},
  rightActionDisabled = false,
}: ISectionHeader) => {
  const theme = useTheme();

  return (
    <Animated.View style={[styles.container, {opacity: style.opacity}]}>
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
    </Animated.View>
  );
};

export default SectionHeader;
