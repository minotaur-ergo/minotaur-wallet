import { MigrationInterface, QueryRunner } from 'typeorm';

export class tx1645511237301 implements MigrationInterface {
  name = 'tx1645511237301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "tx" (
	"id"	integer NOT NULL,
	"tx_id"	text NOT NULL,
	"height"	integer NOT NULL,
	"network_type"	text NOT NULL,
	"date"	integer NOT NULL,
	"status"	text NOT NULL,
	"json"	text NOT NULL,
	CONSTRAINT "UQ_14d23c85c41c5f654d8d5e234cc" UNIQUE("tx_id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);`;
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `DROP TABLE "tx";`;
    await queryRunner.query(sql);
  }
}
