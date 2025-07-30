import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MinotaurCommon',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['bip32', 'blakejs', 'bs58', 'json-bigint', 'tiny-secp256k1'],
      output: {
        globals: {
          'bip32': 'BIP32',
          'blakejs': 'blakejs',
          'bs58': 'bs58',
          'json-bigint': 'JSONBigInt',
          'tiny-secp256k1': 'secp256k1',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
