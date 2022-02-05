import * as React from 'react';
import {TextInput as RNTextInput, TextInputProps} from 'react-native';

import styles from './index.style';

interface ITextInput extends TextInputProps {
  value: string;
  onChangeText: (arg0: string) => void;
}

function TextInput({value, onChangeText, ...props}: ITextInput) {
  return (
    <RNTextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      autoCorrect={false}
      autoCapitalize="none"
      clearButtonMode="while-editing"
      {...props}
    />
  );
}

export default TextInput;
