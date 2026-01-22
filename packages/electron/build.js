import esbuild from 'esbuild';

async function buildPlatformCore() {
  await esbuild.build({
    entryPoints: ['src/electron-platform/index.ts'],
    bundle: true,
    outfile: 'dist/core/index.js',
    platform: 'node',
    target: 'node16',
    minify: true,
    external: ['electron', 'fs', 'path', 'mime-types', 'events'],
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
