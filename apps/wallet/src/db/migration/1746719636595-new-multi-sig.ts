import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMultiSig1746719636595 implements MigrationInterface {
  name = 'NewMultiSig1746719636595';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'DROP TABLE "multi-sign-tx"',
      'DROP TABLE "multi-sign-input"',
      'DROP TABLE "multi-commitment"',
      'DROP TABLE "multi-signer"',
      'DROP TABLE "multi-sign-row"',
      'CREATE TABLE "multi-sig-row" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "txId" text NOT NULL, "walletId" integer, CONSTRAINT "UQ_d10abb7fa2138c33ec626b68a1d" UNIQUE ("txId"), CONSTRAINT "FK_0b3815e8b45296a4d886efac84d" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sig-tx" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "idx" integer NOT NULL, "txId" integer, CONSTRAINT "FK_86f5f5e7efbc0783144e8810a53" FOREIGN KEY ("txId") REFERENCES "multi-sig-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sig-input" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "txId" integer, CONSTRAINT "FK_221e70b5e378dff19fff0aaf566" FOREIGN KEY ("txId") REFERENCES "multi-sig-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sig-hint" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" text NOT NULL, "commit" text NOT NULL, "proof" text, "idx" integer NOT NULL, "inpIdx" integer NOT NULL, "secret" text, "txId" integer, CONSTRAINT "FK_01741904ebec30e536c79a55225" FOREIGN KEY ("txId") REFERENCES "multi-sig-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'ALTER TABLE "multi_sig_key" RENAME TO "multi-sig-key"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'DROP TABLE "multi-sig-tx"',
      'DROP TABLE "multi-sig-input"',
      'DROP TABLE "multi-sig-hint"',
      'DROP TABLE "multi-sig-row"',
      'CREATE TABLE "multi-sign-row" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "txId" text NOT NULL, "walletId" integer, CONSTRAINT "UQ_22d166a78ef90e8aab23a82a01d" UNIQUE ("txId"), CONSTRAINT "FK_1b325330483aa43fab64703fe7a" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sign-tx" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "idx" integer NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_05595439c77fd3771bf77e84cf5" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-sign-input" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "txId" integer, CONSTRAINT "FK_621d2a7eff19a8e95e22da1ab40" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-commitment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "bytes" text NOT NULL, "index" integer NOT NULL, "inputIndex" integer NOT NULL, "secret" text, "txId" integer, CONSTRAINT "FK_9d5228b8828161d8eb2c8286196" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'CREATE TABLE "multi-signer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "signer" text NOT NULL, "type" text NOT NULL, "txId" integer, CONSTRAINT "FK_fa7710bd6c52dc52a08ab8181fe" FOREIGN KEY ("txId") REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
      'ALTER TABLE "multi-sig-key" RENAME TO "multi_sig_key"',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
