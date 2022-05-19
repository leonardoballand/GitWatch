import create from 'zustand';
import {configurePersist} from 'zustand-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {GitWatchUser} from 'types';

const {persist} = configurePersist({
  storage: AsyncStorage, // use `AsyncStorage` in react native
  rootKey: 'root', // optional, default value is `root`
});

interface StoreState {
  user: GitWatchUser;
  setUser: (arg0: string | null, arg1: GitWatchUser) => void;
  deleteUser: () => void;
}

const useStore = create<StoreState>(
  persist(
    {
      key: 'user',
    },
    set => ({
      user: null,
      setUser: (prop, value) => {
        if (prop) {
          set(state => ({user: {...state.user, [prop]: value}}));
        } else {
          set(state => ({user: {...state.user, ...value}}));
        }
      },
      deleteUser: () => set({user: null}),
    }),
  ),
);

export default useStore;
