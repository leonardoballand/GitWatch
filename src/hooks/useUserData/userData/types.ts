import type {SET_USER_DATA, DELETE_DATA, SET_DATA} from './constants';

export type ValueOf<T> = T[keyof T];

export type UserProfile = {
  id: number;
  type: string;
};

export type Locale = 'fr' | 'en' | 'es' | 'de' | 'da' | 'fr_CA';

export interface IUserData<T> {}

export type SetDataAction = {
  type: typeof SET_DATA;
  data: IUserData;
};

export type SetUserDataAction = {
  type: typeof SET_USER_DATA;
  prop: keyof IUserData;
  value: ValueOf<IUserData>;
};

export type DeleteDataAction = {
  type: typeof DELETE_DATA;
};

export type UserDataActions =
  | SetDataAction
  | SetUserDataAction
  | DeleteDataAction;

export type GetUser = (
  arg0?: keyof IUserData,
) => ValueOf<IUserData> | IUserData | null;

export type SetUser = (
  arg0: keyof IUserData | null,
  arg1: ValueOf<IUserData> | IUserData,
) => void;

export type DeleteUser = () => void;

export type OnError = (arg0: string) => void;

export type OnLoadEnd = () => void;
