import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Week5HomeScreen from './Week5HomeScreen';
import {Week5StackParamsList} from 'types';
import Week5SelectMembersScreen from './Week5SelectMembersScreen';
import Week5SelectMilestoneScreen from './Week5SelectMilestoneScreen';
import Week5SelectIssueScreen from './Week5SelectIssueScreen';

const {Navigator, Screen} = createNativeStackNavigator<Week5StackParamsList>();

function Week5Stack() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="Week5Home" component={Week5HomeScreen} />
      <Screen name="Week5SelectMembers" component={Week5SelectMembersScreen} />
      <Screen
        name="Week5SelectMilestone"
        component={Week5SelectMilestoneScreen}
      />
      <Screen name="Week5SelectIssue" component={Week5SelectIssueScreen} />
    </Navigator>
  );
}

export default Week5Stack;
