import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
try {
  const packagePath = fileURLToPath(
    import.meta.resolve('@minotaur-ergo/icons/dist'),
  );
  const destIconPath = path.join(process.cwd(), 'public/icons');
  fs.mkdirSync(destIconPath, { recursive: true });
  const iconsPath = path.join(packagePath, 'icons');
  const files = fs.readdirSync(iconsPath);
  files.forEach((fileName) => {
    const iconPath = path.join(iconsPath, fileName);
    fs.copyFileSync(iconPath, path.join(destIconPath, fileName));
  });
} catch (err) {
  console.error(err);
}
