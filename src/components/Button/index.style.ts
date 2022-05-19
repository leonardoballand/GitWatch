import type {ViewStyle, TextStyle} from 'react-native';

interface IStyle {
  container: (arg0: 'default' | 'fullWidth') => ViewStyle;
  text: TextStyle;
}

const styles: IStyle = {
  container: variant => ({
    alignSelf: variant === 'fullWidth' ? 'stretch' : 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0793F0',
    justifyContent: 'center',
    alignItems: 'center',
    width: variant === 'default' ? 200 : undefined,
    height: 48,
    borderRadius: 24,
    shadowColor: '#0793F0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  }),
  text: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
};

export default styles;
