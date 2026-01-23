/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

async function buildPlatformCore() {
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    platform: 'node',
    target: 'node16',
    minify: true,
    external: ['electron', 'fs', 'path', 'events'],
  });
}

(async () => {
  try {
    await buildPlatformCore();
    console.log('\nPlatform Build Complete.\n');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
