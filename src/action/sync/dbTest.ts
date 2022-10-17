import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DataSource } from 'typeorm';

export const connectCapacitor = async () => {
  let dataSource: DataSource;
  const sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  try {
    dataSource = new DataSource({
      type: 'capacitor',
      database: 'test',
      driver: sqliteConnection,
      logging: true,
    });
    await dataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
    return dataSource;
  } catch (exp) {
    console.log(exp);
    throw exp;
  }
};

//export const initDb = () => { /* empty  */}
