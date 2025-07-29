import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth, Box, Hint, Tx, User, Wallet } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Auth, Wallet, Tx, Box, Hint],
      synchronize: true,
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
