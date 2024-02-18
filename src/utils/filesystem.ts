import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

const readDataFile = (path: string) => {
  if (Capacitor.getPlatform() === 'electron') {
    return window.electronApi.readFile(path);
  } else {
    return Filesystem.readFile({
      path,
      directory: Directory.Data,
    });
  }
};

const writeDataFile = (path: string, data: string) => {
  if (Capacitor.getPlatform() === 'electron') {
    return window.electronApi.writeFile(path, data);
  } else {
    return Filesystem.writeFile({
      path,
      data: data,
      directory: Directory.Data,
    });
  }
};
export { readDataFile, writeDataFile };
