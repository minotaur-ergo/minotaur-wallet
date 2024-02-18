import initSqlJs from 'sql.js/dist/sql-wasm';
import { DataSource } from 'typeorm';
import entities from '@/db/entities';
import migration from '@/db/migration';
import axios from 'axios';

export const loadDatabase = async (url: string) => {
  const data = await axios
    .get(url, {
      responseType: 'arraybuffer',
    })
    .then((res) => Buffer.from(res.data, 'binary'));
  localStorage.setItem(
    'minotaur',
    '[' + Uint8Array.from(data).toString() + ']',
  );
};
const connectSqlJs = async () => {
  window.SQL = await initSqlJs({
    locateFile: (file: string) => `/${file}`,
  });
  const dataSource = new DataSource({
    type: 'sqljs',
    autoSave: true,
    location: 'minotaur',
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
