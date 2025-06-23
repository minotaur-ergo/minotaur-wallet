import fs from 'fs';
import path from 'path';

const perPackage = (resolver) => (files) => {
  return Array.from(
    files.reduce((packages, file) => {
      let directory = path.dirname(file);
      while (directory && directory !== process.cwd()) {
        if (
          fs.existsSync(path.join(directory, 'package.json')) &&
          !directory.endsWith('apps/wallet/electron')
        ) {
          packages.add(resolver(directory, file));
          break;
        }
        const parent = path.dirname(directory);
        if (parent === directory) break;
        directory = parent;
      }
      return packages;
    }, new Set()),
  );
};

export default {
  '*': 'prettier --ignore-unknown --write',
  '**/*.{js,jsx,ts,tsx}': 'eslint --fix',
  '**/*.{ts,tsx}': perPackage((directory) => {
    return `npm run type-check --workspace ${path.relative(process.cwd(), directory)}`;
  }),
};
