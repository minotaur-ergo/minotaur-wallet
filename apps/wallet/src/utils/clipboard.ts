import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import clipboard from 'clipboardy';

const readClipBoard = async (): Promise<string> => {
  if (
    Capacitor.getPlatform() === 'android' ||
    Capacitor.getPlatform() === 'ios'
  ) {
    return (await Clipboard.read()).value;
  } else {
    return clipboard.read();
  }
};

export { readClipBoard };
