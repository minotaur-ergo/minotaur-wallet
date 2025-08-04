import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      exclude: ['node_modules/**'],
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: {
        'node-entry': resolve(__dirname, 'src/node-entry.ts'),
        'browser-entry': resolve(__dirname, 'src/browser-entry.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'ergo-lib-wasm-browser',
        'ergo-lib-wasm-nodejs'
      ],
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  }
});
