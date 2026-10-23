import localforage from 'localforage';
import initSqlJs from 'sql.js/dist/sql-wasm';
import { DataSource } from 'typeorm';

import entities from '@/db/entities';
import migration from '@/db/migration';

const DB_LOCATION = 'minotaur';

/**
 * Database used to be stored in localStorage, which is limited to a few megabytes
 * and too small for large multi-sig transactions. Move it to localforage (IndexedDB).
 */
const migrateFromLocalStorage = async () => {
  const oldContent = window.localStorage.getItem(DB_LOCATION);
  if (oldContent !== null) {
    if ((await localforage.getItem(DB_LOCATION)) === null) {
      await localforage.setItem(DB_LOCATION, oldContent);
    }
    window.localStorage.removeItem(DB_LOCATION);
  }
};

const connectSqlJs = async () => {
  window.SQL = await initSqlJs({
    locateFile: (file: string) => `/${file}`,
  });
  window.localforage = localforage;
  await migrateFromLocalStorage();
  const dataSource = new DataSource({
    type: 'sqljs',
    autoSave: true,
    useLocalForage: true,
    location: DB_LOCATION,
    logging: false,
    entities: entities,
    migrations: migration,
    synchronize: false,
  });
  await dataSource.initialize();
  await dataSource.runMigrations({ transaction: 'each' });
  return dataSource;
};

export default connectSqlJs;
