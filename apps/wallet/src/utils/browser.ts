import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Buffer } from 'buffer';
import localforage from 'localforage';

const openInBrowser = (url: string) => {
  if (Capacitor.getPlatform() === 'electron') {
    window.electronApi.openUrl(url);
  } else {
    Browser.open({ url: url }).then(() => null);
  }
};

const downloadDb = async () => {
  try {
    const stored = await localforage.getItem<string>('minotaur');
    if (stored === null) return;
    const content = Buffer.from(JSON.parse(stored) as Array<number>);
    const filename = 'db.sqlite3';
    const blob = new Blob([content], {
      type: 'octet/stream',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
  }
};

export default openInBrowser;

export { downloadDb };
