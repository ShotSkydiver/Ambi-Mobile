module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFiles: ['./jestSetupFile.js'],
  transformIgnorePatterns: ['node_modules/(?!(jest-)?react-native)'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '\\.(js|ts|tsx)$': require.resolve('react-native/jest/preprocessor.js')
  }
};
