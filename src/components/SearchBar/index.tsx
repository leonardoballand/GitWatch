import * as React from 'react';
import {TextInputProps, TouchableWithoutFeedback} from 'react-native';
import {Input, Icon} from '@ui-kitten/components';
import styles from './index.style';

interface ISearchBar extends Partial<TextInputProps> {
  value: string;
  loading: boolean;
  disabled: boolean;
  onPress: (arg0: string) => void;
  onChangeText: (arg0: string) => void;
  onEndEditing: (arg0: string) => void;
  placeholder: string;
}

function SearchBar({
  value,
  onChangeText,
  onEndEditing,
  loading,
  onPress,
  disabled,
  placeholder,
}: ISearchBar) {
  const zoomIconRef = React.useRef<Icon<'search'>>();

  const renderIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={() => onPress(value)}>
      <Icon name="search" animation="pulse" ref={zoomIconRef} {...props} />
    </TouchableWithoutFeedback>
  );

  React.useEffect(() => {
    function animateOnLoading() {
      if (zoomIconRef.current) {
        if (loading) {
          zoomIconRef.current.startAnimation();
        } else {
          zoomIconRef.current.stopAnimation();
        }
      }
    }

    animateOnLoading();

    () => {
      zoomIconRef.current?.stopAnimation();
    };
  }, [loading]);

  return (
    <Input
      style={styles.searchBar}
      value={value}
      placeholder={placeholder}
      accessoryRight={renderIcon}
      onChangeText={onChangeText}
      onEndEditing={() => onEndEditing(value)}
      autoCapitalize="none"
      autoCorrect={false}
      autoFocus
      disabled={disabled}
    />
  );
}

export default SearchBar;
