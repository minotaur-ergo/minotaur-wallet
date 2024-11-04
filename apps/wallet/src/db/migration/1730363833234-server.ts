import { MigrationInterface, QueryRunner } from 'typeorm';

export class Server1730363833234 implements MigrationInterface {
  name = 'Server1730363833234';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "server" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" text NOT NULL, "secret" text NOT NULL, "public" text NOT NULL, "team_id" text, "walletId" integer, CONSTRAINT "FK_6bd2a7bf2abfc21abc3b4e39578" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-sign-row" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "txId" text NOT NULL, "walletId" integer, "serverId" text, CONSTRAINT "UQ_22d166a78ef90e8aab23a82a01d" UNIQUE ("txId"), CONSTRAINT "FK_1b325330483aa43fab64703fe7a" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-sign-tx" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "idx" integer NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_05595439c77fd3771bf77e84cf5" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-sign-input" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "txId" integer, CONSTRAINT "FK_621d2a7eff19a8e95e22da1ab40" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-commitment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "index" integer NOT NULL, "inputIndex" integer NOT NULL, "secret" text, "txId" integer, CONSTRAINT "FK_9d5228b8828161d8eb2c8286196" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-signer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signer" text NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_fa7710bd6c52dc52a08ab8181fe" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'INSERT INTO "temporary_multi-sign-row"("id", "txId", "walletId") SELECT "id", "txId", "walletId" FROM "multi-sign-row"',
      'INSERT INTO "temporary_multi-sign-tx" SELECT * FROM "multi-sign-tx"',
      'INSERT INTO "temporary_multi-sign-input" SELECT * FROM "multi-sign-input"',
      'INSERT INTO "temporary_multi-commitment" SELECT * FROM "multi-commitment"',
      'INSERT INTO "temporary_multi-signer" SELECT * FROM "multi-signer"',
      'DROP TABLE "multi-signer"',
      'DROP TABLE "multi-commitment"',
      'DROP TABLE "multi-sign-input"',
      'DROP TABLE "multi-sign-tx"',
      'DROP TABLE "multi-sign-row"',
      'ALTER TABLE "temporary_multi-signer" RENAME TO "multi-signer"',
      'ALTER TABLE "temporary_multi-commitment" RENAME TO "multi-commitment"',
      'ALTER TABLE "temporary_multi-sign-input" RENAME TO "multi-sign-input"',
      'ALTER TABLE "temporary_multi-sign-tx" RENAME TO "multi-sign-tx"',
      'ALTER TABLE "temporary_multi-sign-row" RENAME TO "multi-sign-row"',
    ]
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'DROP TABLE "server"',
      'CREATE TABLE "temporary_multi-sign-row" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "txId" text NOT NULL, "walletId" integer,  CONSTRAINT "UQ_22d166a78ef90e8aab23a82a01d" UNIQUE ("txId"), CONSTRAINT "FK_1b325330483aa43fab64703fe7a" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-sign-tx" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "idx" integer NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_05595439c77fd3771bf77e84cf5" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-sign-input" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "txId" integer, CONSTRAINT "FK_621d2a7eff19a8e95e22da1ab40" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-commitment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "index" integer NOT NULL, "inputIndex" integer NOT NULL, "secret" text, "txId" integer, CONSTRAINT "FK_9d5228b8828161d8eb2c8286196" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "temporary_multi-signer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signer" text NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_fa7710bd6c52dc52a08ab8181fe" FOREIGN KEY ("txId") REFERENCES "temporary_multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'INSERT INTO "temporary_multi-sign-row"("id", "txId", "walletId") SELECT "id", "txId", "walletId" FROM "multi-sign-row"',
      'INSERT INTO "temporary_multi-sign-tx" SELECT * FROM "multi-sign-tx"',
      'INSERT INTO "temporary_multi-sign-input" SELECT * FROM "multi-sign-input"',
      'INSERT INTO "temporary_multi-commitment" SELECT * FROM "multi-commitment"',
      'INSERT INTO "temporary_multi-signer" SELECT * FROM "multi-signer"',
      'DROP TABLE "multi-signer"',
      'DROP TABLE "multi-commitment"',
      'DROP TABLE "multi-sign-input"',
      'DROP TABLE "multi-sign-tx"',
      'DROP TABLE "multi-sign-row"',
      'ALTER TABLE "temporary_multi-signer" RENAME TO "multi-signer"',
      'ALTER TABLE "temporary_multi-commitment" RENAME TO "multi-commitment"',
      'ALTER TABLE "temporary_multi-sign-input" RENAME TO "multi-sign-input"',
      'ALTER TABLE "temporary_multi-sign-tx" RENAME TO "multi-sign-tx"',
      'ALTER TABLE "temporary_multi-sign-row" RENAME TO "multi-sign-row"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
