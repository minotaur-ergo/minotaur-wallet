import {MigrationInterface, QueryRunner} from "typeorm";

export class refactorAddress1655184495240 implements MigrationInterface {
    name = "refactorAddress1655184495240"

    public async up(queryRunner: QueryRunner): Promise<void> {
        // create new tmp address table
        const tmpAddress = `CREATE TABLE "temporary_address" (
                                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                                "name" text NOT NULL,
                                "address" text NOT NULL, 
                                "network_type" text NOT NULL, 
                                "path" text NOT NULL, 
                                "idx" integer NOT NULL DEFAULT (-1), 
                                "walletId" integer, 
                                "process_height" integer NOT NULL DEFAULT (0), 
                                CONSTRAINT "address_network_type" UNIQUE ("address", "network_type"), 
                                CONSTRAINT "FK_d64b03f42b8bcc40894545264d7" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
        await queryRunner.query(tmpAddress);
        // insert old values into new table
        const insert = `INSERT INTO "temporary_address"("id", "name", "address", "network_type", "path", "idx", "walletId")
                        SELECT "id", "name", "address", "network_type", "path", "idx", "walletId" FROM "address"`
        await queryRunner.query(insert);
        // drop old address table
        const drop = `DROP TABLE "address"`
        await queryRunner.query(drop)
        // rename tmp address table to new table
        const rename = 'ALTER TABLE "temporary_address" RENAME TO "address"'
        await queryRunner.query(rename)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // create new tmp address table
        const tmpAddress = `CREATE TABLE "temporary_address" (
                                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                                "name" text NOT NULL,
                                "address" text NOT NULL, 
                                "network_type" text NOT NULL, 
                                "path" text NOT NULL, 
                                "idx" integer NOT NULL DEFAULT (-1), 
                                "walletId" integer, 
                                "tx_load_height"	integer NOT NULL DEFAULT (0),
                                "tx_create_box_height"	integer NOT NULL DEFAULT (0),
                                "tx_spent_box_height"	integer NOT NULL DEFAULT (0),
                                CONSTRAINT "address_network_type" UNIQUE ("address", "network_type"), 
                                CONSTRAINT "FK_d64b03f42b8bcc40894545264d7" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
        await queryRunner.query(tmpAddress);
        // insert old values into new table
        const insert = `INSERT INTO "temporary_address"("id", "name", "address", "network_type", "path", "idx", "walletId")
                        SELECT "id", "name", "address", "network_type", "path", "idx", "walletId" FROM "address"`
        await queryRunner.query(insert);
        // drop old address table
        const drop = `DROP TABLE "address"`
        await queryRunner.query(drop)
        // rename tmp address table to new table
        const rename = 'ALTER TABLE "temporary_address" RENAME TO "address"'
        await queryRunner.query(rename)
    }
}