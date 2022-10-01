import { MigrationInterface, QueryRunner } from 'typeorm';
import { addressTokenIdQuery } from './viewsCreationQuery';

export class addressTokenId1645511287133 implements MigrationInterface {
  name = 'addressTokenId1645511287133';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(addressTokenIdQuery.create);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(addressTokenIdQuery.drop);
  }
}
