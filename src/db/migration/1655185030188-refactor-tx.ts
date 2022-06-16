import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorTx1655185030188 implements MigrationInterface {
    name = "refactorTx1655185030188"

    public async up(queryRunner: QueryRunner): Promise<void> {
        // create new tmp tx table
        const tmpTx = `CREATE TABLE "temporary_tx" (
                                    "id"	integer NOT NULL,
                                    "tx_id"	text NOT NULL,
                                    "height"	integer NOT NULL,
                                    "network_type"	text NOT NULL,
                                    "date"	integer NOT NULL,
                                    "status"	text NOT NULL,
                                    CONSTRAINT "UQ_14d23c85c41c5f654d8d5e234cd" UNIQUE("tx_id"),
                                    PRIMARY KEY("id" AUTOINCREMENT))`
        await queryRunner.query(tmpTx);
        // insert old values into new table
        const insert = `INSERT INTO "temporary_tx"("id", "tx_id", "height", "network_type", "date", "status")
                        SELECT "id", "tx_id", "height", "network_type", "date", "status" FROM "tx"`
        await queryRunner.query(insert);
        // drop old tx table
        const drop = `DROP TABLE "tx"`
        await queryRunner.query(drop)
        // rename tmp tx table to new table
        const rename = 'ALTER TABLE "temporary_tx" RENAME TO "tx"'
        await queryRunner.query(rename)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // create new tmp tx table
        const tmpTx = `CREATE TABLE "temporary_tx" (
                                    "id"	integer NOT NULL,
                                    "tx_id"	text NOT NULL,
                                    "height"	integer NOT NULL,
                                    "network_type"	text NOT NULL,
                                    "date"	integer NOT NULL,
                                    "status"	text NOT NULL,
                                    "json"	text NOT NULL,
                                    CONSTRAINT "UQ_14d23c85c41c5f654d8d5e234cd" UNIQUE("tx_id"),
                                    PRIMARY KEY("id" AUTOINCREMENT))`
        await queryRunner.query(tmpTx);
        // insert old values into new table
        const insert = `INSERT INTO "temporary_tx"("id", "tx_id", "height", "network_type", "date", "status", "json")
                        SELECT "id", "tx_id", "height", "network_type", "date", "status", '{}' FROM "tx"`
        await queryRunner.query(insert);
        // drop old tx table
        const drop = `DROP TABLE "tx"`
        await queryRunner.query(drop)
        // rename tmp tx table to new table
        const rename = 'ALTER TABLE "temporary_tx" RENAME TO "tx"'
        await queryRunner.query(rename)
    }

}