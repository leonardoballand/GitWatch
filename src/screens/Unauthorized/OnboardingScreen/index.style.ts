import {TextStyle, ViewStyle} from 'react-native';

interface IStyles {
  wrapper: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  p: TextStyle;
  backdrop: ViewStyle;
  modalTitle: TextStyle;
  modalText: TextStyle;
  modalButton: ViewStyle;
}

const styles: IStyles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    marginHorizontal: 32,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#0793F0',
    fontFamily: 'Nunito',
    fontWeight: '900',
    fontSize: 24,
  },
  p: {
    color: '#2C2424',
    marginVertical: 24,
    fontFamily: 'Nunito',
    fontWeight: '300',
    fontSize: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginTop: 16,
  },
  modalButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
};

export default styles;
