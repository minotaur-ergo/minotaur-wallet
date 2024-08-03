import type { MenuItemConstructorOptions } from 'electron';

const template: Array<MenuItemConstructorOptions> = [
  {
    label: 'Application',
    submenu: [{ role: 'quit' }],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
    ],
  },
  {
    label: 'View',
    submenu: [{ role: 'toggleDevTools' }],
  },
];

export default template;
