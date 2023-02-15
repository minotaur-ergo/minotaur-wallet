import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ml.minotaur.wallet',
  appName: 'minotaur-wallet',
  webDir: 'build',
  bundledWebRuntime: true,
  plugins: {
    CapacitorSQLite: {
      electronLinuxLocation: 'Databases',
      electronMacLocation: 'Databases',
      electronWindowsLocation: 'Databases',
    },
  },
};

export default config;
