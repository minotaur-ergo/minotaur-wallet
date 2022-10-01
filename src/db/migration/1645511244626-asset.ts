import { MigrationInterface, QueryRunner } from 'typeorm';

export class asset1645511244626 implements MigrationInterface {
  name = 'asset1645511244626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "asset" (
	"id"	integer NOT NULL,
	"asset_id"	text NOT NULL,
	"network_type"	text NOT NULL,
	"box_id"	text,
	"name"	text,
	"decimal"	integer DEFAULT (0),
	"description"	text,
	CONSTRAINT "asset_id_network_type" UNIQUE("asset_id","network_type"),
	PRIMARY KEY("id" AUTOINCREMENT)
);`;
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `DROP TABLE "asset";`;
    await queryRunner.query(sql);
  }
}
