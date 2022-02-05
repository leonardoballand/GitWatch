import {SET_DATA, SET_USER_DATA, DELETE_DATA} from './constants';

import type {IUserData, UserDataActions} from './types';

export const userDataInitialState: IUserData | null = null;

export const userDataReducer = (
  state: IUserData | null,
  action: UserDataActions,
) => {
  switch (action.type) {
    case SET_DATA:
      if (state) {
        return {...state, ...action.data};
      } else {
        return {...action.data};
      }

    case SET_USER_DATA:
      return {
        ...state,
        [action.prop]: action.value,
      };

    case DELETE_DATA:
      return userDataInitialState;

    default:
      return state;
  }
};
