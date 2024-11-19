import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'nns.frontend.app',
  appName: 'nns-frontend',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  }
};

export default config;
