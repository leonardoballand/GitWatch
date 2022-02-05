import type {
  DeleteDataAction,
  SetUserDataAction,
  SetDataAction,
  IUserData,
  ValueOf,
} from './types';
import {DELETE_DATA, SET_DATA, SET_USER_DATA} from './constants';

export const setData = (data: IUserData): SetDataAction => ({
  type: SET_DATA,
  data,
});

export const setUserData = (
  prop: keyof IUserData,
  value: ValueOf<IUserData>,
): SetUserDataAction => ({
  type: SET_USER_DATA,
  prop,
  value,
});

export const deleteData = (): DeleteDataAction => ({
  type: DELETE_DATA,
});
