import { MigrationInterface, QueryRunner } from 'typeorm';

export class config1650404055667 implements MigrationInterface {
  name = 'config1650404055667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "config" (
    "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    "key" text NOT NULL,
    "value" text NOT NULL,
    CONSTRAINT "UQ_26489c99ddbb4c91631ef5cc791" UNIQUE ("key"))`;
    await queryRunner.query(sql);
    await queryRunner.query(
      "INSERT INTO config (key, value) VALUES ('display', 'simple')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `DROP TABLE "config";`;
    await queryRunner.query(sql);
  }
}
