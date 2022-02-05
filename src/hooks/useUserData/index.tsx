import React, {useContext, useReducer, createContext, useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import EventEmitter from 'events';

import {userDataInitialState, userDataReducer} from './userData';
import {deleteData, setUserData, setData} from './userData/actions';
import type {
  DeleteUser,
  GetUser,
  IUserData,
  OnError,
  OnLoadEnd,
  SetUser,
  ValueOf,
} from './userData/types';

let USER_DATA_SESSION_KEY = 'user_session';
let IS_WRITING = false;
const StorageEmitter = new EventEmitter();

interface CustomT {
  [key: string]: any;
}

export interface IUserDataContext<T> {
  data: T | null;
  getUser: GetUser;
  setUser: SetUser;
  deleteUser: DeleteUser;
}

interface IProps {
  restoreOnMount?: boolean;
  sessionName?: string;
  onError?: OnError;
  onLoadEnd?: OnLoadEnd;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const UserDataContext = createContext<IUserDataContext>({
  data: null,
  getUser: () => null,
  setUser: () => {},
  deleteUser: () => {},
});

const UserDataProvider: React.FC<IProps> = ({
  children,
  restoreOnMount,
  sessionName = USER_DATA_SESSION_KEY,
  onError = () => {},
  onLoadEnd = () => {},
}) => {
  const [userData, userDataDispatch] = useReducer(
    userDataReducer,
    userDataInitialState,
  );

  /** Get user data
   *
   * When prop is passed, it returns the specified key from user data
   * When prop is undefined, it returns the complete user data
   */
  const getUser = <T extends CustomT>(
    prop?: keyof IUserData<T>,
  ): ValueOf<IUserData<T>> | null | IUserData<T> => {
    if (prop) {
      if (Object.prototype.hasOwnProperty.call(userData, prop)) {
        return userData[prop];
      }

      console.warn(`Error: Cannot find property ${prop} in UserData`);
      onError(`Error: Cannot find property ${prop} in UserData`);
      return null;
    }

    return userData;
  };

  /** Set user data
   *
   * when prop is null, value must be an object and will replace any user data
   * when prop is specified, only the user data prop will be set
   */
  const setUser = async <T extends CustomT>(
    prop: keyof IUserData<T> | null,
    value: ValueOf<IUserData<T>> | IUserData<T>,
  ) => {
    const localData = userData ?? {};

    if (prop) {
      await writeUserData({...localData, [prop]: value});
      userDataDispatch(setUserData(prop, value as ValueOf<IUserData<T>>));
    } else {
      await writeUserData({...localData, ...(value as IUserData<T>)});
      userDataDispatch(setData(value as IUserData<T>));
    }
  };

  const deleteUser = () => userDataDispatch(deleteData());

  const userDataContext: IUserDataContext = {
    data: userData,
    getUser,
    setUser,
    deleteUser,
  };

  const onUserSetLocally = <T extends CustomT>(data: IUserData<T>) =>
    setUser(null, data);

  // Restore previous user data on mount
  // Change session_name to disable restore on app first launch
  useEffect(() => {
    async function restore() {
      try {
        if (restoreOnMount) {
          const data = await EncryptedStorage.getItem(getUserDataSessionKey());

          if (data) {
            if (__DEV__) {
              console.info(
                '[useUserData]: Restoring user data from previous usage...',
              );
            }

            setUser(null, JSON.parse(data));
            onLoadEnd();
          }

          onLoadEnd();
        }
      } catch (e) {
        console.warn(
          'useUserData[Restore]: Error, cannot restore user data',
          e,
        );
        onError(`useUserData[Restore] ${String(e)}`);
      }
    }

    if (sessionName !== USER_DATA_SESSION_KEY) {
      updateUserDataSessionKey(sessionName);
    }

    StorageEmitter.on('error', (error: string) => onError(error));
    StorageEmitter.on('setUserLocally', onUserSetLocally);
    StorageEmitter.on('deleteUserLocally', () => deleteUser());

    restore().then(
      () => {},
      () => {},
    );

    return () => {
      StorageEmitter.off('setUserLocally', onUserSetLocally);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save user data on each updates
  useEffect(() => {
    async function save() {
      try {
        IS_WRITING = true;
        await EncryptedStorage.setItem(
          getUserDataSessionKey(),
          JSON.stringify(userData),
        );
      } catch (e) {
        console.warn('useUserData[Save]: Error, cannot save user data', e);
        onError(`useUserData[Save]: ${String(e)}`);
      } finally {
        IS_WRITING = false;
      }
    }

    save().then(
      () => {},
      () => {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <UserDataContext.Provider value={userDataContext}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;

export const useUserData = <T extends CustomT>() =>
  useContext<IUserDataContext<T>>(UserDataContext);

export const withUserDataContext = <T extends CustomT>(Component: any) => {
  return function WrapperComponent(props: any) {
    const userDataContext = useContext<IUserDataContext<T>>(UserDataContext);

    return (
      <UserDataContext.Consumer>
        {() => <Component {...props} userData={userDataContext.data} />}
      </UserDataContext.Consumer>
    );
  };
};

async function readUserData<T extends CustomT>(): Promise<T | null> {
  try {
    if (IS_WRITING) {
      await delay(500);
    }
    const data = await EncryptedStorage.getItem(USER_DATA_SESSION_KEY);
    if (data !== '{}') {
      return JSON.parse(data!);
    }

    return null;
  } catch (e) {
    if (__DEV__) {
      console.warn('getUserData: An error occurred getting user data.', e);
      StorageEmitter.emit(
        'error',
        `getUserData: An error occurred getting user data => ${String(e)}`,
      );
    }
    return null;
  }
}

async function writeUserData<T extends CustomT>(
  data: IUserData<T>,
): Promise<void> {
  try {
    IS_WRITING = true;
    await EncryptedStorage.setItem(USER_DATA_SESSION_KEY, JSON.stringify(data));
  } catch (e) {
    if (__DEV__) {
      StorageEmitter.emit(
        'error',
        `getUserData: An error occurred writing user data. => ${String(e)}`,
      );
      console.warn('getUserData: An error occurred writing user data.', e);
    }
  } finally {
    IS_WRITING = false;
  }
}

async function removeUserData() {
  try {
    await EncryptedStorage.removeItem(USER_DATA_SESSION_KEY);
  } catch (e) {
    if (__DEV__) {
      StorageEmitter.emit(
        'error',
        `removeUserData error: Cannot remove user data using session key "${USER_DATA_SESSION_KEY}"`,
      );
      console.log(
        `removeUserData error: Cannot remove user data using session key "${USER_DATA_SESSION_KEY}"`,
      );
    }
  }
}

export const getUserLocally = async <T extends CustomT>(
  prop?: keyof T,
): Promise<ValueOf<T> | null | T> => {
  const userData = await readUserData<T>();

  if (userData) {
    if (prop) {
      if (Object.prototype.hasOwnProperty.call(userData, prop)) {
        return userData[prop];
      }

      if (__DEV__) {
        StorageEmitter.emit(
          'error',
          `Error: Cannot find property "${prop}" in UserData`,
        );
        console.log(`Error: Cannot find property "${prop}" in UserData`);
      }
      return null;
    }
    return userData;
  }

  if (__DEV__) {
    StorageEmitter.emit(
      'error',
      `Warning: UserData has not been set-up yet, or session key "${USER_DATA_SESSION_KEY}" does not exist.`,
    );
    console.log(
      `Warning: UserData has not been set-up yet, or session key "${USER_DATA_SESSION_KEY}" does not exist.`,
    );
  }
  return null;
};

export const setUserLocally = async <T extends CustomT>(
  prop: keyof IUserData<T> | null,
  value: ValueOf<IUserData<T>> | IUserData<T>,
) => {
  if (prop) {
    const userData = await readUserData<T>();
    await writeUserData({...userData, [prop]: value});
    StorageEmitter.emit('setUserLocally', {...userData, [prop]: value});
  } else {
    await writeUserData(value as IUserData<T>);
    StorageEmitter.emit('setUserLocally', value);
  }
};

export const deleteUserLocally = async () => {
  await removeUserData();
  StorageEmitter.emit('deleteUserLocally');
};

export const getUserDataSessionKey = () => USER_DATA_SESSION_KEY;

// TODO: Update HOC when update has been done
export const updateUserDataSessionKey = (newSessionKey: string): string => {
  USER_DATA_SESSION_KEY = newSessionKey;

  return newSessionKey;
};
