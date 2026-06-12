import { contextBridge, ipcRenderer } from 'electron';

require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
contextBridge.exposeInMainWorld('electronApi', {
  openUrl: (url: string) => ipcRenderer.send('openUrl', url),
});
console.log('User Preload!');
