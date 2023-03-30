import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const openInBrowser = (url: string) => {
  if (Capacitor.getPlatform() === 'electron') {
    window.electronApi.openUrl(url);
  } else {
    Browser.open({ url: url });
  }
};

export default openInBrowser;
