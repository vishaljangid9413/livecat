import { ConfigPlugin, withAndroidManifest, withInfoPlist } from '@expo/config-plugins';

const withReactNativeShare: ConfigPlugin = (config) => {
  // Modify AndroidManifest.xml if necessary
  config = withAndroidManifest(config, (config) => {
    // Add necessary permissions or configurations
    return config;
  });

  // Modify Info.plist for iOS if necessary
  config = withInfoPlist(config, (config) => {
    // Add necessary keys
    return config;
  });

  return config;
};

export default withReactNativeShare;