import { MigrationInterface, QueryRunner } from "typeorm";

export class wallet1645511249599 implements MigrationInterface {
    name = "wallet1645511249599";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE TABLE "wallet" (
	"id"	integer NOT NULL,
	"name"	text NOT NULL,
	"network_type"	text NOT NULL,
	"seed"	text NOT NULL,
	"extended_public_key"	text NOT NULL,
	"type"	text NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP TABLE "wallet";`;
        await queryRunner.query(sql);
    }

}
