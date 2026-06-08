import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.minotaur_ergo.minotaur',
  appName: 'minotaur',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorSQLite: {
      androidIsEncryption: false,
      electronIsEncryption: false,
    },
  },
};

export default config;
