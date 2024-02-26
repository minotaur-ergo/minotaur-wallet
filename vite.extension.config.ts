import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/

export default defineConfig({
  build: {
    minify: false,
    outDir: '../extension',
    rollupOptions: {
      input: ['./src/connector/extension.html'],
    },
  },
  root: 'src',
  plugins: [react(), topLevelAwait()],
  publicDir: '../public/extension/',
  optimizeDeps: {
    include: ['crypto-js'],
  },
  resolve: {
    alias: [{ find: '@', replacement: '/' }],
  },
});
