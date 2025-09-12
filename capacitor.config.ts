import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qhop.app',
  appName: 'QHop',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
