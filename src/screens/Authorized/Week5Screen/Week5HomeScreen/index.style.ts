import {ViewStyle} from 'react-native';

interface IStyles {
  wrapper: ViewStyle;
  container: ViewStyle;
}

const styles: IStyles = {
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default styles;
