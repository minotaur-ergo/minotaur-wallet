import { MigrationInterface, QueryRunner } from 'typeorm';

export class address1645511254267 implements MigrationInterface {
  name = 'address1645511254267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "address" (
	"id"	integer NOT NULL,
	"name"	text NOT NULL,
	"address"	text NOT NULL,
	"network_type"	text NOT NULL,
	"path"	text NOT NULL,
	"idx"	integer NOT NULL DEFAULT (-1),
	"tx_load_height"	integer NOT NULL DEFAULT (0),
	"tx_create_box_height"	integer NOT NULL DEFAULT (0),
	"tx_spent_box_height"	integer NOT NULL DEFAULT (0),
	"walletId"	integer,
	CONSTRAINT "address_network_type" UNIQUE("address","network_type"),
	CONSTRAINT "FK_d64b03f42b8bcc40894545264d7" FOREIGN KEY("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	PRIMARY KEY("id" AUTOINCREMENT)
);`;
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `DROP TABLE "address";`;
    await queryRunner.query(sql);
  }
}
