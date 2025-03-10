import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pin1740834014451 implements MigrationInterface {
  name = 'Pin1740834014451';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "pin" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_ba9e21a5c04e8f4346d4a6d9b65" UNIQUE ("type"))',
      'CREATE TABLE "temporary_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" text NOT NULL, "value" text NOT NULL, "pinType" text NOT NULL DEFAULT (\'\'), CONSTRAINT "UQ_126deff6b13be5a01e645d49a7d" UNIQUE ("key", "pinType"))',
      'INSERT INTO "temporary_config"("id", "key", "value") SELECT "id", "key", "value" FROM "config"',
      'DROP TABLE "config"',
      'ALTER TABLE "temporary_config" RENAME TO "config"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "temporary_config" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "key" text NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_26489c99ddbb4c91631ef5cc791" UNIQUE ("key"))',
      'DELETE from config WHERE pinType <> ""',
      'INSERT INTO "temporary_config"("id", "key", "value") SELECT "id", "key", "value" FROM "config"',
      'DROP TABLE "config"',
      'ALTER TABLE "temporary_config" RENAME TO "config"',
      'DROP TABLE "pin"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
