import React, {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {Avatar, Text, useTheme} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import AppHeader from 'components/AppHeader';
import styles from './index.style';
import {Week5StackParamsList} from 'types';
import {BackIcon, NextIcon} from 'components/Icons';
import getOrganizationMembers from 'api/github/getOrganizationMembers';
import {GQLUser} from 'graphql/schema';
import SearchBar from 'components/SearchBar';
import {DraxProvider, DraxList, DraxView} from 'react-native-drax';

type Props = NativeStackScreenProps<Week5StackParamsList, 'Week5SelectMembers'>;

type RouteProps = Props['route'];
type NavigationProps = Props['navigation'];

function Week5SelectMembersScreen() {
  const {goBack, navigate} = useNavigation<NavigationProps>();
  const theme = useTheme();

  const [search, setSearch] = useState('');
  const [originalMembers, setOriginalMembers] = useState<(GQLUser | undefined)[] | undefined
  >();
  const [members, setMembers] = useState<(GQLUser | undefined)[] | undefined>(
    [],
  );
  const [squadMembers, setSquadMembers] = useState<(GQLUser | undefined)[] | undefined
  >([]);

  const goBackHome = () => goBack();

  const goToSelectMilestone = () => navigate('Week5SelectMilestone');

  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goBackHome}>
        <BackIcon />
      </TouchableOpacity>
    );
  };

  const renderRightAction = () => {
    return (
      <TouchableOpacity style={styles.nextButton} onPress={goToSelectMilestone}>
        <Text status="primary" category="c2">
          Boost your milestone
        </Text>
        <NextIcon size={8} color={theme['color-primary-400']} />
      </TouchableOpacity>
    );
  };

  const fetchMembers = async () => {
    const data = await getOrganizationMembers('fulll');
    console.log('members', members);

    const organizationsUsers = data?.edges?.map(edge => edge?.node);
    setMembers(organizationsUsers);
    setOriginalMembers(organizationsUsers);
  };

  const renderUser = ({item}: {item: GQLUser}) => {
    return (
      <DraxView
        style={{
          marginRight: 16,
          width: 95,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onDragStart={() => {
          console.log('start drag');
        }}
        payload={item}>
        <Avatar
          style={{marginBottom: 8}}
          source={{uri: item.avatarUrl}}
          size="giant"
        />
        <Text category="c1" numberOfLines={1}>
          {item.login}
        </Text>
      </DraxView>
    );
  };

  const onChangeText = (value: string) => setSearch(value);

  const onSearchPress = () => {
    const filteredMembers = originalMembers?.filter(originalMember =>
      originalMember?.login.includes(search),
    );
    setMembers(filteredMembers);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!search) {
      setMembers(originalMembers);
    }
  }, [search]);

  return (
    <>
      <AppHeader
        title="Build your squad"
        level={5}
        accessoryLeft={renderBackAction}
        accessoryRight={renderRightAction}
      />

      <View style={styles.wrapper}>
        <DraxProvider>
          <View style={styles.container}>
            <SearchBar
              value={search}
              onChangeText={onChangeText}
              loading={false}
              disabled={false}
              onPress={onSearchPress}
              onEndEditing={() => {}}
              placeholder="Whose awesome-member do you want?"
            />

            <FlatList
              style={{height: 100}}
              contentContainerStyle={{
                height: 100,
                paddingHorizontal: 16,
              }}
              horizontal
              snapToInterval={10}
              snapToAlignment="center"
              showsHorizontalScrollIndicator={false}
              data={members}
              extraData={members}
              renderItem={renderUser}
            />
          </View>

          <View style={{marginTop: 24, marginHorizontal: 16}}>
            <Text style={{marginBottom: 16}} category="h4">
              Your squad
            </Text>

            <DraxView
              style={{
                height: 100,
                width: 100,
                borderRadius: 24,
                backgroundColor: 'lightblue',
              }}
              onReceiveDragEnter={({dragged: {payload}}) => {
                console.log(`hello ${payload}`);
              }}
              onReceiveDragExit={({dragged: {payload}}) => {
                console.log(`goodbye ${payload}`);
              }}
              onReceiveDragDrop={({dragged: {payload}}) => {
                console.log(`received ${payload}`);
                setSquadMembers(prevState => [...prevState, payload]);
              }}
            />

            <FlatList
              style={{height: 100}}
              contentContainerStyle={{
                height: 100,
                paddingHorizontal: 16,
              }}
              horizontal
              snapToInterval={10}
              snapToAlignment="center"
              showsHorizontalScrollIndicator={false}
              data={squadMembers}
              extraData={squadMembers}
              renderItem={renderUser}
            />
          </View>
        </DraxProvider>
      </View>
    </>
  );
}

export default Week5SelectMembersScreen;
