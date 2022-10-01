import { MigrationInterface, QueryRunner } from 'typeorm';
import Box from '../entities/Box';

export class createAssetsCount1656865711897 implements MigrationInterface {
  name = 'createAssetsCount1656865711897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = 'ALTER TABLE "box" ADD "asset_count" integer DEFAULT (0)';
    await queryRunner.query(sql);
    const oldBoxes = (await queryRunner.query(
      'SELECT * FROM box'
    )) as Array<Box>;
    for (let item of oldBoxes) {
      const boxJson = JSON.parse(item.json);
      const assetCount = boxJson.hasOwnProperty('assets')
        ? boxJson.assets.length
        : 0;
      await queryRunner.query(
        `UPDATE box set asset_count=${assetCount} WHERE id=${item.id}`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration doesn't need to be reverted
  }
}
