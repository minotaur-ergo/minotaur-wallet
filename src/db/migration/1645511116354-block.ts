import { MigrationInterface, QueryRunner } from "typeorm";

export class block1645511116354 implements MigrationInterface {
    name = "block1645511116354";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE TABLE "block" (
	"id"	integer NOT NULL,
	"block_id"	text NOT NULL,
	"network_type"	text NOT NULL,
	"height"	integer NOT NULL,
	"status"	text NOT NULL DEFAULT ('NOT_PROCEED'),
	CONSTRAINT "UQ_bce676e2b005104ccb768495dbb" UNIQUE("height"),
	CONSTRAINT "block_id_in_network" UNIQUE("block_id","network_type"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP TABLE "block";`;
        await queryRunner.query(sql);
    }

}
