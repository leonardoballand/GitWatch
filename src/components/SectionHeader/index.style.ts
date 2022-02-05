import {TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  container: ViewStyle;
  titleContainer: ViewStyle;
  title: TextStyle;
  icon: ViewStyle;
  label: (arg0: string) => TextStyle;
}

const styles: IStyles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  title: {
    textTransform: 'uppercase',
  },
  label: color => ({
    color,
    textTransform: 'none',
  }),
};

export default styles;
