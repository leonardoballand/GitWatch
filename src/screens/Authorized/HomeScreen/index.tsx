import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabStackParamsList} from 'types';
import DashboardScreen from '../DashboardScreen';
import Week5Screen from '../Week5Screen';
import SettingsScreen from '../SettingsScreen';
import {DashboardIcon, SettingsIcon, Week5Icon} from 'components/Icons';

const {Navigator, Screen} = createBottomTabNavigator<TabStackParamsList>();

function HomeScreen() {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarIcon: DashboardIcon}}
      />
      <Screen
        name="Week5"
        component={Week5Screen}
        options={{tabBarIcon: Week5Icon}}
      />
      <Screen
        name="Settings"
        component={SettingsScreen}
        options={{tabBarIcon: SettingsIcon}}
      />
    </Navigator>
  );
}

export default HomeScreen;
