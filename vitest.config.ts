import { defineConfig } from 'vitest/config';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  test: {
    coverage: {
      all: true,
      reporter: ['cobertura', 'text', 'text-summary'],
    },
    deps: {
      inline: [/ergo-lib-wasm-browser/, /typeorm/],
    },
    environment: 'happy-dom',
    transformMode: {
      web: [/\.([cm]?[jt]sx?|json)$/],
    },
  },
  plugins: [wasm(), topLevelAwait()],
  optimizeDeps: {
    disabled: true,
  },
});
