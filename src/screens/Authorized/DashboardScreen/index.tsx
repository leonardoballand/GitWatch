import * as React from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppHeader from 'components/AppHeader';
import {GitWatchUser, TabStackParamsList} from 'types';
import {useUserData} from 'hooks/useUserData';
import {
  PullRequestIcon,
  ReviewIcon,
  NotificationsIcon,
  WorkflowIcon,
} from 'components/Icons';
import SectionHeader from 'components/SectionHeader';
import ActionsTabScreen from './ActionsTabScreen';
import PullRequestsTabScreen from './PullRequestsTabScreen';

type Props = NativeStackScreenProps<TabStackParamsList, 'Dashboard'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

const TopTab = createMaterialTopTabNavigator();

import ReviewsTabScreen from './ReviewsTabScreen';

function MyTabBar({state, descriptors, navigation, position}) {
  const topTabRef = React.useRef<ScrollView>();

  React.useEffect(() => {
    topTabRef.current?.scrollTo({x: 200 * state.index, animated: true});
  }, [position]);

  return (
    <ScrollView
      ref={topTabRef}
      style={{
        flexDirection: 'row',
        maxHeight: 70,
      }}
      contentContainerStyle={{
        // maxHeight: 50,
        paddingHorizontal: 16,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={200}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const Icon =
          options.tabBarIcon !== undefined ? options.tabBarIcon : undefined;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0.5)),
        });

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              width: 200,
              marginRight: 24,
            }}>
            <SectionHeader style={{opacity}} icon={<Icon />} title={label} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function DashboardTabs() {
  return (
    <TopTab.Navigator
      initialRouteName="Actions"
      initialLayout={{width: Dimensions.get('window').width}}
      tabBar={props => <MyTabBar {...props} />}>
      <TopTab.Screen
        name="Actions"
        component={ActionsTabScreen}
        options={{
          tabBarLabel: 'Github Actions',
          tabBarIcon: WorkflowIcon,
        }}
      />
      <TopTab.Screen
        name="PullRequests"
        component={PullRequestsTabScreen}
        options={{
          tabBarLabel: 'Pull Requests',
          tabBarIcon: PullRequestIcon,
        }}
      />

      <TopTab.Screen
        name="Reviews"
        component={ReviewsTabScreen}
        options={{
          tabBarLabel: 'Reviews',
          tabBarIcon: ReviewIcon,
        }}
      />
    </TopTab.Navigator>
  );
}

function DashboardScreen() {
  const {data: userData} = useUserData<GitWatchUser>();
  const theme = useTheme();

  const openNotifications = () => {};

  const renderRightAction = () => {
    return (
      <TouchableOpacity disabled onPress={openNotifications}>
        <NotificationsIcon color={theme['color-basic-500']} />
      </TouchableOpacity>
    );
  };

  // Everhour examples
  // React.useEffect(() => {
  //   getAllProjects('components.mobile');
  //   getProject('gh:286967155');
  //   getProjectTasks('gh:286967155');
  // }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#F8F8F8'}}>
      <AppHeader
        title={`Hi ${userData?.firstName}`}
        description="Let's watch your repositories"
        level={1}
        color="#F8F8F8"
        accessoryRight={renderRightAction}
      />

      <View style={{flex: 1, marginTop: 24}}>
        <DashboardTabs />
      </View>
    </View>
  );
}

export default DashboardScreen;
