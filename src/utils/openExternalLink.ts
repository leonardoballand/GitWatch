import {Linking} from 'react-native';

const openExternalLink = (url: string) => Linking.openURL(url);

export default openExternalLink;
