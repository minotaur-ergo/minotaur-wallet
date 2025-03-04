import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pin1740834014451 implements MigrationInterface {
  name = 'Pin1740834014451';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "pin" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL, "value" text NOT NULL, CONSTRAINT "UQ_ba9e21a5c04e8f4346d4a6d9b65" UNIQUE ("type"))',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = ['DROP TABLE "pin"'];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
