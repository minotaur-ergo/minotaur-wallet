import initSqlJs from 'sql.js/dist/sql-wasm';
import { DataSource } from 'typeorm';
import entities from '@/db/entities';
import migration from '@/db/migration';

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
  await dataSource.undoLastMigration({ transaction: 'each' });
  await dataSource.runMigrations({ transaction: 'each' });
  return dataSource;
};

export default connectSqlJs;
