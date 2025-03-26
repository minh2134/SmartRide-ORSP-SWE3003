const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'ttf'].filter(ext => ext !== 'svg'),
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'svg'],
    extraNodeModules: {
      'react-native-vector-icons': require.resolve('react-native-vector-icons'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
