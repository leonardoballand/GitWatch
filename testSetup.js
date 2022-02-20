import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.useFakeTimers();

/* Silence the warning: Animated: `useNativeDriver` is
 * not supported because the native animated module is missing
 */
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve('{ "foo": 1 }')),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('react-native-vector-icons/Octicons', () => 'Octicons');

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
