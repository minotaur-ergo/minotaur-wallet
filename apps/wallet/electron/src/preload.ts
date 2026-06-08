import { contextBridge, ipcRenderer } from 'electron';

require('./rt/electron-rt');
//////////////////////////////
// User Defined Preload scripts below
contextBridge.exposeInMainWorld('electronApi', {
  httpRequest: (options: unknown) => ipcRenderer.invoke('httpRequest', options),
  openUrl: (url: string) => ipcRenderer.send('openUrl', url),
});
console.log('User Preload!');
