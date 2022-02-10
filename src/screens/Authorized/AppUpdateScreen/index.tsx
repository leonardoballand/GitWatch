import React from 'react';
import {View, Image} from 'react-native';
import {Button, Text, useTheme} from '@ui-kitten/components';
import type {AppStackParamsList} from 'types';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useRoute} from '@react-navigation/native';
import openExternalLink from 'utils/openExternalLink';

type Props = NativeStackScreenProps<AppStackParamsList, 'AppUpdate'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function AppUpdateScreen() {
  const {params} = useRoute<RouteProps>();
  const theme = useTheme();

  const downloadUpdate = () => {
    console.log('params.downloadurl', params.downloadURL);
    openExternalLink(params.downloadURL);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View>
        <Image
          style={{height: 200, width: 500, resizeMode: 'cover'}}
          source={{
            uri: 'https://png.pngtree.com/illustrations/20190322/ourmid/pngtree-business-office-flat-character-meeting-png-image_37339.jpg',
          }}
        />
        <View style={{marginHorizontal: 16}}>
          <View style={{marginVertical: 24, alignItems: 'center'}}>
            <Text
              style={{textAlign: 'center', marginBottom: 4}}
              category="h3"
              status="primary">
              New update available
            </Text>

            <Text category="c1">
              Version {params.displayVersion} - Build {params.buildVersion}
            </Text>
          </View>

          <View>
            <Text style={{marginBottom: 16}} category="h5">
              Woooow!
            </Text>
            <Text category="p2">
              Our awesome GitWatch app is now as beautiful as ever! Don't miss
              this new experience, read the release notes carefully and download
              it!
            </Text>

            <View
              style={{
                marginTop: 24,
                borderWidth: 1,
                borderColor: theme['color-primary-500'],
                padding: 16,
                borderRadius: 4,
              }}>
              <Text category="c1">{params.releaseNotes ?? ''}</Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: theme['color-primary-500'],
          padding: 16,
          paddingBottom: 24,
        }}>
        <Button
          status="primary"
          style={{borderRadius: 24}}
          onPress={downloadUpdate}>
          Download now
        </Button>
      </View>
    </View>
  );
}

export default AppUpdateScreen;
