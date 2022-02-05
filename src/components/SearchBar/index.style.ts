import {ViewStyle} from 'react-native';

interface IStyles {
  searchBar: ViewStyle;
}

const styles: IStyles = {
  searchBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    borderColor: '#F5F5F5',
  },
};

export default styles;
