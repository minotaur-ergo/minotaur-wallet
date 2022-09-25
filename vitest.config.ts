import { defineConfig } from 'vitest/config';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  test: {
    deps: {
      inline: [/ergo-lib-wasm-browser/],
    },
    environment: 'happy-dom'
  },
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  optimizeDeps: {
    disabled: true,
  },
});
