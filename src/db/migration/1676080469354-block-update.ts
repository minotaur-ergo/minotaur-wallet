import { MigrationInterface, QueryRunner } from 'typeorm';

export class blockUpdate1676080469354 implements MigrationInterface {
  name = 'blockUpdate1676080469354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "temporary_block" (
	"id"	integer NOT NULL,
	"block_id"	text NOT NULL,
	"network_type"	text NOT NULL,
	"height"	integer NOT NULL,
	"status"	text NOT NULL DEFAULT ('NOT_PROCEED'),
	CONSTRAINT "height_id_in_network" UNIQUE("height", "network_type"),
	CONSTRAINT "block_id_in_network" UNIQUE("block_id","network_type"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
`;
    await queryRunner.query(sql);
    const insertSql = `INSERT INTO "temporary_block"("id", "block_id", "network_type", "height", "status") 
SELECT "id", "block_id", "network_type", "height", "status" FROM "block"`;
    await queryRunner.query(insertSql);
    const dropOldSql = `DROP TABLE "block"`;
    await queryRunner.query(dropOldSql);
    const renameQuery = `ALTER TABLE "temporary_block" RENAME TO "block"`;
    await queryRunner.query(renameQuery);
  }

  public async down(): Promise<void> {
    /* empty */
  }
}
