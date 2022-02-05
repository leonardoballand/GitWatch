import {ViewStyle} from 'react-native';

interface IStyles {
  input: ViewStyle;
}

const styles: IStyles = {
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
};

export default styles;
