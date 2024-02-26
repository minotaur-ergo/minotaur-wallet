import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), wasm(), topLevelAwait()],
    optimizeDeps: {
      include: ['crypto-js'],
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
    publicDir: command === 'build' ? false : undefined,
  };
});
