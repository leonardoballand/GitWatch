import {ViewStyle} from 'react-native';

interface IStyles {
  container: ViewStyle;
  list: ViewStyle;
  listContent: ViewStyle;
}

const styles: IStyles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    flexGrow: 1,
    marginHorizontal: 16,
  },
  listContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
};

export default styles;
