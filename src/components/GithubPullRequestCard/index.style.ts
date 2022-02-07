import {TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  wrapper: ViewStyle;
  container: ViewStyle;
  headerTitleContainer: ViewStyle;
  title: TextStyle;
  footerContainer: ViewStyle;
}

const styles: IStyles = {
  wrapper: {
    backgroundColor: 'white',
    marginBottom: 24,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  headerTitleContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 16,
  },
  title: {
    marginBottom: 8,
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
};

export default styles;
