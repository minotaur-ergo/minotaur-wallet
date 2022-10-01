import { MigrationInterface, QueryRunner } from 'typeorm';
import { walletWithErgQuery } from './viewsCreationQuery';

export class walletWithErg1645511292840 implements MigrationInterface {
  name = 'walletWithErg1645511292840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(walletWithErgQuery.create);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(walletWithErgQuery.drop);
  }
}
