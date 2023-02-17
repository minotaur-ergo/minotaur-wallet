import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiSig1676570528123 implements MigrationInterface {
  name = 'MultiSig1676570528123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      `CREATE TABLE "multi-sign-row" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "txId" text NOT NULL, 
                "walletId" integer, 
                CONSTRAINT "UQ_22d166a78ef90e8aab23a82a01d" UNIQUE ("txId"), 
                CONSTRAINT "FK_1b325330483aa43fab64703fe7a" FOREIGN KEY ("walletId") 
                    REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
      `CREATE TABLE "multi-sign-tx" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "bytes" text NOT NULL, 
                "index" integer NOT NULL, 
                "txId" integer, CONSTRAINT "FK_05595439c77fd3771bf77e84cf5" FOREIGN KEY ("txId") 
                    REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
      `CREATE TABLE "multi-sign-input" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "bytes" text NOT NULL, 
                "txId" integer, 
                CONSTRAINT "FK_621d2a7eff19a8e95e22da1ab40" FOREIGN KEY ("txId") 
                    REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
      `CREATE TABLE "multi-commitment" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                "bytes" text NOT NULL, 
                "index" integer NOT NULL,
                 "secret" integer NOT NULL, 
                 "txId" integer, CONSTRAINT "FK_9d5228b8828161d8eb2c8286196" FOREIGN KEY ("txId") 
                    REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      `DROP TABLE "multi-sign-input"`,
      `DROP TABLE "multi-sign-tx"`,
      `DROP TABLE "multi-commitment"`,
      `DROP TABLE "multi-sign-row"`,
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
