import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialize1636983754090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `
        BEGIN TRANSACTION
-- creating a new table: wallet
CREATE TABLE "wallet" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "mnemonic" text NOT NULL, "type" text NOT NULL)
-- creating a new table: address
CREATE TABLE "address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "address" text NOT NULL, "path" text NOT NULL, "idx" integer NOT NULL DEFAULT (-1), "last_height" integer NOT NULL, "walletId" integer, CONSTRAINT "UQ_0a1ed89729fa10ba8b81b99f305" UNIQUE ("address"), CONSTRAINT "FK_d64b03f42b8bcc40894545264d7" FOREIGN KEY ("walletId") REFERENCES "wallet" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)
-- creating a new table: tx
CREATE TABLE "tx" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tx_id" text NOT NULL, "height" integer NOT NULL, "date" integer NOT NULL, "status" text NOT NULL, "json" text NOT NULL, CONSTRAINT "UQ_14d23c85c41c5f654d8d5e234cc" UNIQUE ("tx_id"))
-- creating a new table: asset
CREATE TABLE "asset" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "asset_id" text NOT NULL, "name" text NOT NULL, "decimal" integer NOT NULL, "description" text NOT NULL, CONSTRAINT "UQ_2a48e81afa7729ed31c2c7b18ed" UNIQUE ("asset_id"))
-- creating a new table: box
CREATE TABLE "box" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "box_id" text NOT NULL, "erg" integer NOT NULL, "nano_erg" integer NOT NULL, "create_index" integer NOT NULL, "spend_index" integer, "json" text NOT NULL, "addressId" integer, "txId" integer, "spendTxId" integer, CONSTRAINT "UQ_f9fc3e81ec95fcca34d8961e9db" UNIQUE ("box_id"), CONSTRAINT "FK_14236ae97af5ea5b397608f7407" FOREIGN KEY ("addressId") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5b31002d4c1324301a7cd133433" FOREIGN KEY ("txId") REFERENCES "tx" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bffbc3bffd8f3cace9337245609" FOREIGN KEY ("spendTxId") REFERENCES "tx" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)
-- creating a new table: box_content
CREATE TABLE "box_content" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "token_id" text NOT NULL, "amount" integer NOT NULL, "boxId" integer, CONSTRAINT "FK_b612cfac8dfbee42efd03697b58" FOREIGN KEY ("boxId") REFERENCES "box" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)
-- creating a new view: wallet_with_erg
CREATE VIEW "wallet_with_erg" AS SELECT "Wallet"."id" AS "id", "Wallet"."name" AS "name", "Wallet"."mnemonic" AS "mnemonic", "Wallet"."type" AS "type", SUM("Box"."erg") AS "erg", Sum("Box"."nano_erg") AS "nano_erg" FROM "wallet" "Wallet" LEFT JOIN "address" "Address" ON "Address"."walletId"="Wallet"."id"  LEFT JOIN "box" "Box" ON "Box"."addressId"="Address"."id" WHERE "Box"."spendTxId" IS NULL GROUP BY "Wallet"."id"
-- creating a new view: address_with_erg
CREATE VIEW "address_with_erg" AS SELECT "Address"."id" AS "id", "Address"."name" AS "name", "Address"."address" AS "address", "Address"."path" AS "path", "Address"."idx" AS "idx", "Address"."last_height" AS "last_height", "Address"."walletId" AS "walletId", SUM("Box"."erg") AS "erg", Sum("Box"."nano_erg") AS "nano_erg", Sum("Box"."nano_erg") AS "nano_erg2" FROM "address" "Address" LEFT JOIN "box" "Box" ON "Box"."addressId"="Address"."id" WHERE "Box"."spendTxId" IS NULL GROUP BY "Address"."id"
-- creating a new view: wallet_tx
CREATE VIEW "wallet_tx" AS SELECT "Tx"."id" AS "id", "Tx"."tx_id" AS "tx_id", "Tx"."height" AS "height", "Tx"."date" AS "date", "Tx"."status" AS "status", "Tx"."json" AS "json", "CreateAddress"."walletId" AS "create_wallet_id", "SpentAddress"."walletId" AS "spent_wallet_id", SUM("CreateBox"."erg") AS "create_erg", SUM("CreateBox"."nano_erg") AS "create_nano_erg", SUM("SpentBox"."erg") AS "spent_erg", SUM("SpentBox"."nano_erg") AS "spent_nano_erg" FROM "tx" "Tx" LEFT JOIN "box" "CreateBox" ON "CreateBox"."txId" = "Tx"."id"  LEFT JOIN "address" "CreateAddress" ON "CreateAddress"."id"="CreateBox"."addressId"  LEFT JOIN "box" "SpentBox" ON "SpentBox"."spendTxId" = "Tx"."id"  LEFT JOIN "address" "SpentAddress" ON "SpentAddress"."id"="SpentBox"."addressId" GROUP BY "Tx"."id" ORDER BY date DESC
COMMIT
`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `
BEGIN TRANSACTION
DELETE VIEW wallet_tx;
DELETE VIEW address_with_erg;
DELETE VIEW wallet_with_erg;
DELETE VIEW box_content;
DELETE VIEW box;
DELETE VIEW asset;
DELETE VIEW tx;
DELETE VIEW address;
DELETE VIEW wallet;
COMMIT`;
        await queryRunner.query(sql);
    }

}
