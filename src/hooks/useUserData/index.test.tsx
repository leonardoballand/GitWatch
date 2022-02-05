import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';

import UserDataTesting from './UserDataTesting';
import type {IUserData, ValueOf} from './userData/types';
// import MockedEncryptedStorage from './EncryptedStorage'

import UserDataProvider from './index';

jest.useFakeTimers();

// const TEST_SAVED_DATA = {
//     firstname: 'Benjamin',
//     lastname: 'Mico',
//     token: 'BomDiaGente!'
// }

describe('useUserData hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('set new user data', () => {
    const testData: IUserData = {
      firstname: 'Benjamin',
      lastname: 'Mico',
      token: 'BomDiaGente!',
    };

    const {getByTestId} = render(
      <UserDataProvider restoreOnMount={false}>
        <UserDataTesting testData={testData} />
      </UserDataProvider>,
    );

    const FirstNameText = getByTestId('FIRSTNAME_TEXT');
    expect(FirstNameText.props.children).toEqual(null);

    const LastNameText = getByTestId('LASTNAME_TEXT');
    expect(LastNameText.props.children).toEqual(null);

    const TokenText = getByTestId('TOKEN_TEXT');
    expect(TokenText.props.children).toEqual(null);

    const SetUserButton = getByTestId('USER_INIT_BUTTON');
    expect(SetUserButton).toBeTruthy();

    fireEvent.press(SetUserButton);

    expect(FirstNameText.props.children).toEqual(testData.firstname);
    expect(LastNameText.props.children).toEqual(testData.lastname);
    expect(TokenText.props.children).toEqual(testData.token);
  });

  test('update a user data key', () => {
    const testData: IUserData = {
      firstname: 'Benjamin',
      lastname: 'Mico',
      token: 'BomDiaGente!',
    };

    const customData = {
      key: 'firstname' as keyof IUserData,
      value: 'Benji' as ValueOf<IUserData>,
    };

    const {getByTestId} = render(
      <UserDataProvider>
        <UserDataTesting testData={testData} customData={customData} />
      </UserDataProvider>,
    );

    const SetUserButton = getByTestId('USER_INIT_BUTTON');
    const FirstNameText = getByTestId('FIRSTNAME_TEXT');
    const LastNameText = getByTestId('LASTNAME_TEXT');
    const TokenText = getByTestId('TOKEN_TEXT');

    fireEvent.press(SetUserButton);

    expect(FirstNameText.props.children).toEqual(testData.firstname);
    expect(LastNameText.props.children).toEqual(testData.lastname);
    expect(TokenText.props.children).toEqual(testData.token);

    const UpdateButton = getByTestId('USER_SET_CUSTOM_KEY_BUTTON');

    fireEvent.press(UpdateButton);

    expect(FirstNameText.props.children).toEqual(customData.value);
  });

  test('remove user data', () => {
    const testData: IUserData = {
      firstname: 'Laurent',
      lastname: 'Falorni',
      token: 'BomDiaGente!',
      locale: 'fr',
    };

    const {getByTestId} = render(
      <UserDataProvider>
        <UserDataTesting testData={testData} />
      </UserDataProvider>,
    );

    const SetUserButton = getByTestId('USER_INIT_BUTTON');
    const FirstNameText = getByTestId('FIRSTNAME_TEXT');
    const LastNameText = getByTestId('LASTNAME_TEXT');
    const TokenText = getByTestId('TOKEN_TEXT');

    fireEvent.press(SetUserButton);

    expect(FirstNameText.props.children).toEqual(testData.firstname);
    expect(LastNameText.props.children).toEqual(testData.lastname);
    expect(TokenText.props.children).toEqual(testData.token);

    const RemoveUserDataButton = getByTestId('USER_REMOVE_BUTTON');

    fireEvent.press(RemoveUserDataButton);

    expect(FirstNameText.props.children).toEqual(null);
    expect(LastNameText.props.children).toEqual(null);
    expect(TokenText.props.children).toEqual(null);
  });

  //   test('restore previous user data', async () => {
  //     const mockImpl = new MockedEncryptedStorage();
  //     jest.mock('react-native-encrypted-storage', () => mockImpl);

  //     const sessionName = "session_test"

  //     const { getByTestId } = render(
  //         <UserDataProvider restoreOnMount sessionName={sessionName}>
  //             <UserDataTesting />
  //         </UserDataProvider>
  //     );

  //     const FirstNameText = getByTestId('FIRSTNAME_TEXT')
  //     expect(FirstNameText.props.children).toEqual(TEST_SAVED_DATA.firstname)

  //     const LastNameText = getByTestId('LASTNAME_TEXT')
  //     expect(LastNameText.props.children).toEqual(TEST_SAVED_DATA.lastname)

  //     const TokenText = getByTestId('TOKEN_TEXT')
  //     expect(TokenText.props.children).toEqual(TEST_SAVED_DATA.token)
  //   });
});
