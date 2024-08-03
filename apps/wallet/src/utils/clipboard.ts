import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import clipboard from 'clipboardy';

const readClipBoard = (): Promise<string> => {
  if (
    Capacitor.getPlatform() === 'android' ||
    Capacitor.getPlatform() === 'ios'
  ) {
    return Clipboard.read().then((res) => res.value);
  } else {
    return clipboard.read();
  }
};

export { readClipBoard };
