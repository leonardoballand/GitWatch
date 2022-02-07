import {ImageStyle, TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  screenContainer: ViewStyle;
  slide: ViewStyle;
  title: TextStyle;
  image: ImageStyle;
  text: TextStyle;
  buttonCircle: ViewStyle;
  toggle: ViewStyle;
}

const styles: IStyles = {
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
    marginBottom: 32,
  },
  text: {
    marginVertical: 16,
    textAlign: 'center',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    margin: 8,
  },
};

export default styles;
