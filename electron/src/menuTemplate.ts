import { app } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';
import { MenuItem } from 'electron';

const template: Array<MenuItemConstructorOptions> = [
  {
    label: 'Application',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Cut', accelerator: 'CmdOrCtrl+X' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V' },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
      },
    ],
  },
  {
    label: 'View',
    submenu: [{ role: 'toggleDevTools' }],
  },
];

export default template;
