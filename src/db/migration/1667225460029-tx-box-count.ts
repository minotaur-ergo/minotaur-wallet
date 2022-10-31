import { MigrationInterface, QueryRunner } from 'typeorm';
import { TxBoxCountQuery } from './viewsCreationQuery';

export class txBoxCount1667225460029 implements MigrationInterface {
  name = 'txBoxCount1667225460029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(TxBoxCountQuery.create);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(TxBoxCountQuery.drop);
  }
}
