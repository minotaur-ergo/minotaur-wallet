import { mkdirSync, existsSync, readdirSync, rmSync } from 'fs';

if (existsSync('src/icons')) {
  rmSync('src/icons', { recursive: true });
}
mkdirSync('src/icons', { recursive: true });
readdirSync('src').forEach((fileName) => {
  if (fileName.startsWith('token-') && fileName.endsWith('.ts')) {
    rmSync(`src/${fileName}`);
  }
});
