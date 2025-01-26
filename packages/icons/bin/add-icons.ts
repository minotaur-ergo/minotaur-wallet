import * as fs from 'fs';

const main = async () => {
  fs.mkdirSync('./dist/icons', { recursive: true });

  await fs.promises.cp('src/icons', 'dist/icons', { recursive: true });
};

main().then(() => null);
