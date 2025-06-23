import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import mkcert from 'vite-plugin-mkcert';
// import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/

export default defineConfig({
  server: { https: {} }, // Not needed for Vite 5+
  build: {
    minify: false,
    target: 'es2022',
  },
  plugins: [react(), wasm(), mkcert()],
  optimizeDeps: {
    include: ['crypto-js'],
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
