import {ViewStyle} from 'react-native';

interface IStyles {
  wrapper: ViewStyle;
  container: ViewStyle;
  backdrop: ViewStyle;
}

const styles: IStyles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    marginHorizontal: 16,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export default styles;
