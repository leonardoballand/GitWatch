import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AppHeader from 'components/AppHeader';
import {Week5StackParamsList} from 'types';
import {BackIcon, NextIcon} from 'components/Icons';
import styles from './index.style';

type Props = NativeStackScreenProps<
  Week5StackParamsList,
  'Week5SelectMilestone'
>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function Week5SelectMilestoneScreen() {
  const {goBack, navigate} = useNavigation<NavigationProps>();
  const theme = useTheme();

  const goBackHome = () => goBack();

  const goToSelectIssue = () => navigate('Week5SelectIssue');

  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goBackHome}>
        <BackIcon />
      </TouchableOpacity>
    );
  };

  const renderRightAction = () => {
    return (
      <TouchableOpacity style={styles.nextButton} onPress={goToSelectIssue}>
        <Text status="primary" category="c2">
          Dispatch issue
        </Text>
        <NextIcon size={8} color={theme['color-primary-400']} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppHeader
        title="Boost your milestone"
        level={5}
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightAction}
      />

      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text category="h4">Milestone</Text>
        </View>
      </View>
    </>
  );
}

export default Week5SelectMilestoneScreen;
