import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const pad = (value: number) => value.toString().padStart(2, '0');

const qrCodeFileName = (date: Date = new Date()) =>
  `qrcode-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}-${pad(date.getHours())}-${pad(date.getMinutes())}.json`;

const downloadInBrowser = (fileName: string, content: string) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = fileName;
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Let the user choose where to store a text file.
 * electron: native save dialog. android/ios: system share sheet (Save to Files, Drive, ...).
 * web: browser download.
 * returns false when user canceled.
 */
const saveFile = async (fileName: string, content: string) => {
  const platform = Capacitor.getPlatform();
  if (platform === 'electron') {
    return window.electronApi.saveFile(fileName, content);
  }
  if (platform === 'android' || platform === 'ios') {
    const file = await Filesystem.writeFile({
      path: fileName,
      data: content,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    try {
      await Share.share({ title: fileName, files: [file.uri] });
      return true;
    } catch (e) {
      // share sheet dismissed by user
      console.log(e);
      return false;
    }
  }
  downloadInBrowser(fileName, content);
  return true;
};

/**
 * Open system file picker and return content of selected file as text.
 * returns empty string when user canceled.
 */
const readFile = () =>
  new Promise<string>((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (file) {
        file
          .text()
          .then((content) => resolve(content.trim()))
          .catch(reject);
      } else {
        resolve('');
      }
    });
    input.addEventListener('cancel', () => resolve(''));
    input.click();
  });

export { qrCodeFileName, readFile, saveFile };
