import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [react(), wasm(), topLevelAwait()],
  optimizeDeps: {
    include: ['crypto-js', '@emotion/styled'],
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  esbuild: {
    keepNames: true,
    minifySyntax: false,
    minifyIdentifiers: false,
  },
});
