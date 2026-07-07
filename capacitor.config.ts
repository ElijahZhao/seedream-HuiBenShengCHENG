import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seedream.app',
  appName: 'Seedream',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
