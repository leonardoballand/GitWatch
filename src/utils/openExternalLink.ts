import {Linking} from 'react-native';
import Toast from 'react-native-toast-message';

const openExternalLink = async (url: string) => {
  try {
    const canOpenUrl = await Linking.canOpenURL(url);

    if (canOpenUrl) {
      await Linking.openURL(url);
    } else {
      console.log('Cannot open url', url);
    }
  } catch (e) {
    console.log('openExternalLink error', e);

    Toast.show({
      type: 'error',
      text1: 'Ooooops!',
      text2: 'Could not open link. Please report to developers team',
    });
  }
};

export default openExternalLink;
