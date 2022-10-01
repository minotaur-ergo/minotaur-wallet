import { MigrationInterface, QueryRunner } from 'typeorm';
import { AssetCountBoxesQuery } from './viewsCreationQuery';

export class createAssetsCountBoxes1656865730031 implements MigrationInterface {
  name = 'createAssetsCountBoxes1656865730031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(AssetCountBoxesQuery.create);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(AssetCountBoxesQuery.drop);
  }
}
