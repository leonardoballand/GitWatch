module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'relay',
      {
        artifactDirectory: './src/graphql/__generated__',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '*': './src/*',
          'test-utils': './test-utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
