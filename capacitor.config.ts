import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.minotaur_ergo.minotaur',
  appName: 'minotaur',
  webDir: 'dist',
  plugins: {
    CapacitorSQLite: {
      androidIsEncryption: false,
      electronIsEncryption: false,
    },
  },
};

export default config;
