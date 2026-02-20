import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { entities } from './entities';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: entities,
  migrations: [],
  subscribers: [],
});
