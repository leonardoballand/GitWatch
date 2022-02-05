import {ViewStyle} from 'react-native';

interface IStyles {
  container: (arg0: string) => ViewStyle;
  navigation: ViewStyle;
}

const styles: IStyles = {
  container: color => ({
    backgroundColor: color ?? 'white',
    paddingBottom: 8,
    paddingHorizontal: 16,
  }),
  navigation: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 24,
    marginBottom: 24,
  },
};

export default styles;
