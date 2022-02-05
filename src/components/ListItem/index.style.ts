import {TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  container: ViewStyle;
  content: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  label: TextStyle;
}

const styles: IStyles = {
  container: {
    margin: 8,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {fontSize: 16, marginBottom: 6, fontWeight: '500'},
  description: {fontSize: 12},
  label: {},
};

export default styles;
