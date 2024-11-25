import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'nns.frontend.app',
  appName: 'Nông Nghiệp Số',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  }
};

export default config;
