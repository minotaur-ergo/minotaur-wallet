/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

async function buildCliScrpts() {
  await esbuild.build({
    entryPoints: ['src/cli-scripts/index.ts'],
    bundle: true,
    outfile: 'dist/cli-scripts/cap-scripts.js',
    platform: 'node',
    target: 'node16',
    minify: true,
    external: [
      'child_process',
      'fs',
      'path',
      'fs-extra',
      'crypto',
      'chalk',
      'ora',
    ],
  });
}

async function buildPlatformCore() {
  await esbuild.build({
    entryPoints: ['src/electron-platform/index.ts'],
    bundle: true,
    outfile: 'dist/electron-platform/index.js',
    platform: 'node',
    target: 'node16',
    minify: true,
    external: ['electron', 'fs', 'path', 'mime-types', 'events'],
  });
}

(async () => {
  try {
    await buildPlatformCore();
    await buildCliScrpts();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
