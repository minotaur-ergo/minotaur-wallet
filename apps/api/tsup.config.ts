import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  clean: true,
  minify: true,
  bundle: true,
  skipNodeModulesBundle: true,
  target: 'node20',
  platform: 'node',
  external: ['crypto'],
  banner: {
    js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
    `,
  },
});
