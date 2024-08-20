import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpendBoxInfo1719388610915 implements MigrationInterface {
  name = 'SpendBoxInfo1719388610915';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "temporary_wallet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "network_type" text NOT NULL, "seed" text NOT NULL, "extended_public_key" text NOT NULL, "type" text NOT NULL, "required_sign" integer, "version" integer NOT NULL DEFAULT (1), "flags" text NOT NULL DEFAULT (\'\'), "encrypted_mnemonic" text NOT NULL DEFAULT (\'\'))',
      'INSERT INTO "temporary_wallet"("id", "name", "network_type", "seed", "extended_public_key", "type", "required_sign", "version") SELECT "id", "name", "network_type", "seed", "extended_public_key", "type", "required_sign", "version" FROM "wallet"',
      'DROP TABLE "wallet"',
      'ALTER TABLE "temporary_wallet" RENAME TO "wallet"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "temporary_wallet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "network_type" text NOT NULL, "seed" text NOT NULL, "extended_public_key" text NOT NULL, "type" text NOT NULL, "required_sign" integer, "version" integer NOT NULL DEFAULT (1))',
      'INSERT INTO "temporary_wallet"("id", "name", "network_type", "seed", "extended_public_key", "type", "required_sign", "version") SELECT "id", "name", "network_type", "seed", "extended_public_key", "type", "required_sign", "version" FROM "wallet"',
      'DROP TABLE "wallet"',
      'ALTER TABLE "temporary_wallet" RENAME TO "wallet"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
