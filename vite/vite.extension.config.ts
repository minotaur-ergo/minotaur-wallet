import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';
import { crx } from '@crxjs/vite-plugin';
import { manifest } from '../src/connector/service/manifest';
// https://vitejs.dev/config/

export default defineConfig({
  build: {
    minify: false,
    outDir: 'extension',
  },
  root: '.',
  plugins: [react(), topLevelAwait(), crx({ manifest })],
  publicDir: 'ext-public',
});
