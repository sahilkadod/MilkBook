const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;

module.exports = mergeConfig(getDefaultConfig(projectRoot), {
  watchFolders: [path.resolve(projectRoot, 'node_modules')],
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
});