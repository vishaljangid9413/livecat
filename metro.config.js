// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

/** @type {import('expo/metro-config').MetroConfig} */
  const config = getDefaultConfig(__dirname);
  const isExpo = config.projectType === 'app';
  let newConfig = {}

  if (isExpo) {
    return config;
  } else {
    filterAssetExtList = config.resolver.assetExts.filter((ext) => ext !== 'svg')    
    config.resolver = {
      ...config.resolver,
      resolveRequest: MetroSymlinksResolver(),
      assetExts: [...filterAssetExtList, 'bin'],
      sourceExts: [...config.resolver.sourceExts, 'svg'],
    }
    config.transformer = {
      ...config.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    }
    config['projectRoot'] = __dirname
  }

module.exports = config;