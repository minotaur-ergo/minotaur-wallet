import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DataSource } from 'typeorm';

import entities from '@/db/entities';
import migration from '@/db/migration';

const connectCapacitor = async () => {
  const sqliteConnection = await new SQLiteConnection(CapacitorSQLite);
  let dataSource: DataSource | null = null;
  try {
    dataSource = new DataSource({
      type: 'capacitor',
      database: 'minotaur',
      driver: sqliteConnection,
      logging: false,
      synchronize: false,
      entities: entities,
      migrations: migration,
    });
    await dataSource.initialize();
    await dataSource.runMigrations({ transaction: 'each' });
    return dataSource;
  } catch (exp) {
    if (dataSource) {
      await dataSource.close();
    }
    console.log(exp);
    throw exp;
  }
};

export default connectCapacitor;
