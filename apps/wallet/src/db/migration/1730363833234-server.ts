import { MigrationInterface, QueryRunner } from 'typeorm';

export class Server1730363833234 implements MigrationInterface {
  name = 'Server1730363833234';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = [
      'CREATE TABLE "server" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "address" text NOT NULL, "secret" text NOT NULL, "public" text NOT NULL, "teamId" text, "walletId" integer, CONSTRAINT "FK_6bd2a7bf2abfc21abc3b4e39578" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)',
    ];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const queries = ['DROP TABLE "server"'];
    for (const query of queries) {
      await queryRunner.query(query);
    }
  }
}
