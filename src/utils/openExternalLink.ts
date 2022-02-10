import {Linking} from 'react-native';

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
  }
};

export default openExternalLink;
