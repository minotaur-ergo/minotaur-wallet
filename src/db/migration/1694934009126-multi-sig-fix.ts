import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiSigFix1694934009126 implements MigrationInterface {
  name = 'MultiSigFix1694934009126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      `DROP TABLE IF EXISTS "multi-signer"`,
      `DROP TABLE IF EXISTS  "multi-sign-input"`,
      `DROP TABLE IF EXISTS  "multi-sign-tx"`,
      `DROP TABLE IF EXISTS  "multi-commitment"`,
      `CREATE TABLE "multi-sign-tx" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "bytes" text NOT NULL, 
                "idx" integer NOT NULL, 
                "txId" integer,
                "type" text NOT NULL, 
                CONSTRAINT "FK_05595439c77fd3771bf77e84cf6" FOREIGN KEY ("txId") 
                    REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
      `CREATE TABLE "multi-sign-input" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "bytes" text NOT NULL, 
                "txId" integer, 
                CONSTRAINT "FK_621d2a7eff19a8e95e22da1ab41" FOREIGN KEY ("txId") 
                    REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
      `CREATE TABLE "multi-commitment" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "bytes" text NOT NULL, 
                "index" integer NOT NULL,
                "inputIndex" integer NOT NULL,
                "secret" text, 
                "txId" integer, CONSTRAINT "FK_9d5228b8828161d8eb2c8286197" FOREIGN KEY ("txId") 
                    REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
      `CREATE TABLE "multi-signer" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "signer" text NOT NULL, 
                "type" text NOT NULL, 
                "txId" integer, 
                CONSTRAINT "FK_fa7710bd6c52dc52a08ab8181ff" FOREIGN KEY ("txId") 
                    REFERENCES "multi-sign-row" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      `DROP TABLE "multi-signer"`,
      `DROP TABLE "multi-sign-input"`,
      `DROP TABLE "multi-sign-tx"`,
      `DROP TABLE "multi-commitment"`,
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
