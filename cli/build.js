import { execSync } from 'child_process';

const packagesInOrder = [
  'packages/icons',
  'packages/ergo-lib',
  'packages/types',
  'packages/utils',
  'packages/electron',
  'packages/http',
];

for (const pkg of packagesInOrder) {
  console.log(`\n🔨 Building ${pkg}...`);
  execSync(`npm run build -w ${pkg}`, {
    stdio: 'inherit',
  });
}
