import {TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  container: (arg0: string) => ViewStyle;
  label: (arg0: string) => TextStyle;
}

const styles: IStyles = {
  container: color => ({
    backgroundColor: color,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 16,
  }),
  label: color => ({
    color,
    fontSize: 9,
  }),
};

export default styles;
