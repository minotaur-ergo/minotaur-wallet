import { MigrationInterface, QueryRunner } from 'typeorm';

export class box1645511260273 implements MigrationInterface {
  name = 'box1645511260273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "box" (
	"id"	integer NOT NULL,
	"box_id"	text NOT NULL,
	"network_type"	text NOT NULL,
	"erg"	text NOT NULL,
	"create_index"	integer NOT NULL,
	"create_height"	integer NOT NULL,
	"spend_index"	integer,
	"spend_height"	integer,
	"json"	text NOT NULL,
	"addressId"	integer,
	"txId"	integer,
	"spendTxId"	integer,
	CONSTRAINT "box_id_in_network" UNIQUE("network_type","box_id"),
	CONSTRAINT "FK_14236ae97af5ea5b397608f7407" FOREIGN KEY("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_5b31002d4c1324301a7cd133433" FOREIGN KEY("txId") REFERENCES "tx"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_bffbc3bffd8f3cace9337245609" FOREIGN KEY("spendTxId") REFERENCES "tx"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	PRIMARY KEY("id" AUTOINCREMENT)
);`;
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `DROP TABLE "box";`;
    await queryRunner.query(sql);
  }
}
