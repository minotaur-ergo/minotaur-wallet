import { MigrationInterface, QueryRunner } from 'typeorm';
import { addressWithErgQuery } from './viewsCreationQuery';

export class addressWithErg1645511276955 implements MigrationInterface {
  name = 'addressWithErg1645511276955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(addressWithErgQuery.create);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(addressWithErgQuery.drop);
  }
}
