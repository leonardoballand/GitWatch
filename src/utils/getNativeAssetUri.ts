import {Platform} from 'react-native';

const ANDROID_ASSETS_DIRECTORY = 'images';

const getNativeAssetUri = (asset: string): string => {
  const [name, ext] = asset.split('.');

  if (name && ext) {
    if (Platform.OS === 'ios') {
      return name;
    }

    return `asset:/${ANDROID_ASSETS_DIRECTORY}/${name}.${ext}`;
  }

  console.error('getNativeAssetUri: Use asset_name.asset_extension format.');
  return '';
};

export default getNativeAssetUri;
