import {ViewStyle} from 'react-native';

interface IStyles {
  wrapper: ViewStyle;
  container: ViewStyle;
  nextButton: ViewStyle;
}

const styles: IStyles = {
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 24,
  },
  container: {},
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export default styles;
