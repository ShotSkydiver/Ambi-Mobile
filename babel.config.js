module.exports = api => {
  api.cache(true);
  if (
    process.env.ENV === 'production' ||
    (process.env.BABEL_ENV && process.env.BABEL_ENV === 'production')
  ) {
    return {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
        'transform-remove-console',
        'react-native-paper/babel',
        'add-react-displayname',
        './node_modules/@heap/react-native-heap/instrumentor/src/index.js'
      ]
    };
  } else {
    return {
      presets: ['module:metro-react-native-babel-preset']
    };
  }
};
