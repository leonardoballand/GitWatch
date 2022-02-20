module.exports = {
  preset: '@testing-library/react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'test-utils', __dirname],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/testSetup.js'],
  modulePathIgnorePatterns: [
    'e2e',
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?(@react-native|react-native|react-native-vector-icons)|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)',
  ],
  testResultsProcessor: '<rootDir>/node_modules/jest-html-reporter',
  watchPathIgnorePatterns: ['__fixtures__\\/[^/]+\\/(output|error)\\.js'],
  coverageDirectory: '<rootDir>/__coverage__',
};
