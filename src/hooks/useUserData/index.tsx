import React, {
  useContext,
  useReducer,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import EventEmitter from 'events';

import {userDataInitialState, userDataReducer} from './userData';
import {deleteData, setUserData, setData} from './userData/actions';
import type {
  DeleteUser,
  GetUser,
  IUserData,
  KeyOf,
  OnError,
  OnLoadEnd,
  SetUser,
  ValueOf,
} from './userData/types';

let USER_DATA_SESSION_KEY = 'user_session';
let IS_WRITING = false;
const StorageEmitter = new EventEmitter();

export interface IUserDataContext {
  data: IUserData | null;
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
  const getUser = useCallback(
    (prop?: keyof IUserData): ValueOf<IUserData> | null | IUserData => {
      if (prop) {
        if (Object.prototype.hasOwnProperty.call(userData, prop)) {
          return userData ? userData[prop] : null;
        }

        console.error(`Error: Cannot find property ${prop} in UserData`);
        onError(`Error: Cannot find property ${prop} in UserData`);
        return null;
      }

      return userData;
    },
    [onError, userData],
  );

  /** Set user data
   *
   * when prop is null, value must be an object and will replace any user data
   * when prop is specified, only the user data prop will be set
   */
  const setUser = (
    prop: keyof IUserData | null,
    value: ValueOf<IUserData> | IUserData,
  ) => {
    if (prop) {
      userDataDispatch(setUserData(prop, value as ValueOf<IUserData>));
    } else {
      userDataDispatch(setData(value as IUserData));
    }
  };

  const deleteUser = () => userDataDispatch(deleteData());

  const userDataContext: IUserDataContext = useMemo(
    () => ({
      data: userData,
      getUser,
      setUser,
      deleteUser,
    }),
    [getUser, userData],
  );

  const onUserSetLocally = (data: IUserData) => setUser(null, data);

  // Restore previous user data on mount
  // Change session_name to disable restore on app first launch
  useEffect(() => {
    async function restore() {
      try {
        if (restoreOnMount) {
          const data = await EncryptedStorage.getItem(sessionName);

          if (data) {
            if (__DEV__) {
              console.info(
                '[useUserData]: Restoring user data from previous usage...',
              );
            }

            setUser(null, JSON.parse(data) as IUserData);
            onLoadEnd();
          }
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

export const useUserData = () => useContext<IUserDataContext>(UserDataContext);

export const withUserDataContext = (Component: any) =>
  function WrapperComponent(props: any) {
    const userDataContext = useContext<IUserDataContext>(UserDataContext);

    return (
      <UserDataContext.Consumer>
        {() => <Component {...props} userData={userDataContext.data} />}
      </UserDataContext.Consumer>
    );
  };

async function readUserData<T extends {}>(): Promise<T | null> {
  try {
    if (IS_WRITING) {
      await delay(500);
    }
    const data = await EncryptedStorage.getItem(USER_DATA_SESSION_KEY);
    if (data !== '{}') {
      return JSON.parse(data!) as T;
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

async function writeUserData<T extends {}>(data: T): Promise<void> {
  try {
    IS_WRITING = true;
    await EncryptedStorage.setItem(USER_DATA_SESSION_KEY, JSON.stringify(data));
  } catch (e) {
    if (__DEV__) {
      StorageEmitter.emit(
        'error',
        `getUserData: An error occurred writing user data. => ${String(e)}`,
      );
      console.error('getUserData: An error occurred writing user data.', e);
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

export const getUserLocally = async <T extends {}>(
  prop?: KeyOf<T>,
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

export const setUserLocally = async <T extends {}>(
  prop: KeyOf<T> | null,
  value: ValueOf<T> | T,
) => {
  if (prop) {
    const userData = await readUserData();
    await writeUserData({...userData, [prop]: value});
    StorageEmitter.emit('setUserLocally', {...userData, [prop]: value});
  } else {
    await writeUserData(value as IUserData);
    StorageEmitter.emit('setUserLocally', value);
  }
};

export const deleteUserLocally = async () => {
  await removeUserData();
  StorageEmitter.emit('deleteUserLocally');
};

export const getUserDataSessionKey = (): string => USER_DATA_SESSION_KEY;

// TODO: Update HOC when update has been done
export const updateUserDataSessionKey = (newSessionKey: string): string => {
  USER_DATA_SESSION_KEY = newSessionKey;

  return newSessionKey;
};
