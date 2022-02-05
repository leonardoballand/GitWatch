import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import type { IUserData, ValueOf } from './userData/types';
import { useUserData } from '.';

interface IProps {
  testData?: IUserData;
  customData?: {
    key: keyof IUserData;
    value: ValueOf<IUserData>;
  };
}

const UserDataTesting: FC<IProps> = ({ testData, customData }) => {
  const { getUser, setUser, deleteUser } = useUserData();

  return (
    <View>
      <Text testID="FIRSTNAME_TEXT">{getUser('firstname')}</Text>
      <Text testID="LASTNAME_TEXT">{getUser('lastname')}</Text>
      <Text testID="TOKEN_TEXT">{getUser('token')}</Text>
      {customData && (
        <Text testID="CUSTOM_TEXT">{getUser(customData.key)}</Text>
      )}

      <TouchableOpacity
        testID="USER_INIT_BUTTON"
        onPress={() => setUser(null, testData)}
      >
        <Text>Initialize user with test data</Text>
      </TouchableOpacity>

      {customData && (
        <TouchableOpacity
          testID="USER_SET_CUSTOM_KEY_BUTTON"
          onPress={() => setUser(customData.key, customData.value)}
        >
          <Text>Set custom key text value</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        testID="USER_REMOVE_BUTTON"
        onPress={() => deleteUser()}
      >
        <Text>Remove user data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserDataTesting;
