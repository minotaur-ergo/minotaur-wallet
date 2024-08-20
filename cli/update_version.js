// eslint-disable-next-line @typescript-eslint/no-var-requires
import fs from 'fs';
import process from 'process';
import { fileURLToPath } from 'url';

async function main() {
  if (process.argv.length < 3) {
    throw Error('No version specified');
  }
  for (let file_path of [
    'apps/wallet/package.json',
    'apps/wallet/electron/package.json',
  ]) {
    let data = fs.readFileSync(file_path, 'utf8');
    let root = JSON.parse(data);
    root.version = process.argv[2];
    data = JSON.stringify(root, null, 2);
    fs.writeFileSync(file_path, data, 'utf8');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
