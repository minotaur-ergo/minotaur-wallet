import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Buffer } from 'buffer';

const openInBrowser = (url: string) => {
  if (Capacitor.getPlatform() === 'electron') {
    window.electronApi.openUrl(url);
  } else {
    Browser.open({ url: url }).then(() => null);
  }
};

const downloadDb = () => {
  try {
    const content = Buffer.from(
      JSON.parse(localStorage.minotaur)
        .map((item: number) => ('0' + item.toString(16)).slice(-2))
        .join(''),
      'hex',
    );
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
