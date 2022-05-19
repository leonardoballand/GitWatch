import React from 'react';
import {TouchableOpacity, Text, ViewStyle} from 'react-native';

import styles from './index.style';

interface ButtonProps {
  variant?: 'default' | 'fullWidth';
  children: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button = ({
  children,
  onPress,
  variant = 'default',
  disabled,
  style = {},
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container(variant), style]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
