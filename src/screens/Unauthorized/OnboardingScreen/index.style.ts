import {TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  wrapper: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  p: TextStyle;
}

const styles: IStyles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    marginHorizontal: 16,
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
  },
  p: {
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
};

export default styles;
