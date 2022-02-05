import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppHeader from 'components/AppHeader';
import {AppStackParamsList} from 'types';
import {BackIcon} from 'components/Icons';

type Props = NativeStackScreenProps<AppStackParamsList, 'PullRequestDetails'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

const PullRequestDetailsScreen = ({}: Props) => {
  const {goBack} = useNavigation<NavigationProps>();
  const {params} = useRoute<RouteProps>();

  const goBackHome = () => goBack();

  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goBackHome}>
        <BackIcon />
      </TouchableOpacity>
    );
  };

  const {data} = params;

  return (
    <>
      <AppHeader
        title={data.title}
        level={5}
        accessoryLeft={renderBackAction}
      />

      <ScrollView
        style={{backgroundColor: 'white'}}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={{marginHorizontal: 16}}>
          <Markdown>{data.body}</Markdown>
        </View>
      </ScrollView>
    </>
  );
};

export default PullRequestDetailsScreen;
