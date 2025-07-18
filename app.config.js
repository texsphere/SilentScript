require('dotenv').config();

export default ({ config }) => {
  return {
    ...config,
    name: 'NepSign',
    slug: 'NepSign',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.NepSign',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-av',
        {
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
      'expo-mail-composer'
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      googleCloudApiKey: process.env.GOOGLE_CLOUD_API_KEY,
      eas: {
        projectId: '2d83f124-f7a3-43ea-8316-16723326f212',
      },
    },
  };
}; 