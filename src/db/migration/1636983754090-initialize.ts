import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialize1636983754090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `
BEGIN TRANSACTION;

DROP VIEW IF EXISTS "token_with_address";
DROP VIEW IF EXISTS "wallet_tx";
DROP VIEW IF EXISTS "wallet_with_erg";
DROP VIEW IF EXISTS "address_token_id";
DROP VIEW IF EXISTS "address_with_erg";
DROP TABLE IF EXISTS "box_content";
DROP TABLE IF EXISTS "box";
DROP TABLE IF EXISTS "address";
DROP TABLE IF EXISTS "wallet";
DROP TABLE IF EXISTS "asset";
DROP TABLE IF EXISTS "tx";
DROP TABLE IF EXISTS "block";

CREATE TABLE IF NOT EXISTS "block" (
	"id"	integer NOT NULL,
	"block_id"	text NOT NULL,
	"network_type"	text NOT NULL,
	"height"	integer NOT NULL,
	"status"	text NOT NULL DEFAULT ('NOT_PROCEED'),
	CONSTRAINT "UQ_bce676e2b005104ccb768495dbb" UNIQUE("height"),
	CONSTRAINT "block_id_in_network" UNIQUE("block_id","network_type"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "tx" (
	"id"	integer NOT NULL,
	"tx_id"	text NOT NULL,
	"height"	integer NOT NULL,
	"network_type"	text NOT NULL,
	"date"	integer NOT NULL,
	"status"	text NOT NULL,
	"json"	text NOT NULL,
	CONSTRAINT "UQ_14d23c85c41c5f654d8d5e234cc" UNIQUE("tx_id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "asset" (
	"id"	integer NOT NULL,
	"asset_id"	text NOT NULL,
	"network_type"	text NOT NULL,
	"box_id"	text,
	"name"	text,
	"decimal"	integer DEFAULT (0),
	"description"	text,
	CONSTRAINT "asset_id_network_type" UNIQUE("asset_id","network_type"),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "wallet" (
	"id"	integer NOT NULL,
	"name"	text NOT NULL,
	"network_type"	text NOT NULL,
	"seed"	text NOT NULL,
	"extended_public_key"	text NOT NULL,
	"type"	text NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "address" (
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
);

CREATE TABLE IF NOT EXISTS "box" (
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
);

CREATE TABLE IF NOT EXISTS "box_content" (
	"id"	integer NOT NULL,
	"token_id"	text NOT NULL,
	"amount"	text NOT NULL,
	"boxId"	integer,
	CONSTRAINT "token_id_in_box" UNIQUE("token_id","boxId"),
	CONSTRAINT "FK_b612cfac8dfbee42efd03697b58" FOREIGN KEY("boxId") REFERENCES "box"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
	PRIMARY KEY("id" AUTOINCREMENT)
);


CREATE VIEW "address_with_erg" AS SELECT "Address"."id" AS "id", "Address"."name" AS "name", "Address"."address" AS "address", "Address"."network_type" AS "network_type", "Address"."path" AS "path", "Address"."idx" AS "idx", "Address"."walletId" AS "walletId", (SELECT CAST(SUM(CAST("Box"."erg" AS INT)) AS TEXT) FROM box Box WHERE Box.addressId = "Address"."id" AND Box.spendTxId IS NULL) AS "erg_str", (SELECT COUNT(DISTINCT(BoxContent.token_id)) FROM box_content BoxContent INNER JOIN box Box ON Box.id = BoxContent.boxId WHERE Box.addressId = "Address"."id" AND Box.spendTxId IS NULL) AS "token_count" FROM "address" "Address";

CREATE VIEW "address_token_id" AS SELECT "Address"."id" AS "id", "BoxContent"."token_id" AS "token_id" FROM "address" "Address" LEFT JOIN "box" "Box" ON "Box"."addressId"="Address"."id"  LEFT JOIN "box_content" "BoxContent" ON "Box"."id"="BoxContent"."boxId" WHERE "Box"."spendTxId" IS NULL;

CREATE VIEW "wallet_with_erg" AS SELECT "Wallet"."id" AS "id", "Wallet"."name" AS "name", "Wallet"."network_type" AS "network_type", "Wallet"."seed" AS "seed", "Wallet"."extended_public_key" AS "extended_public_key", "Wallet"."type" AS "type", (SELECT CAST(SUM(CAST("address_with_erg"."erg_str" AS INT)) AS TEXT) from address_with_erg WHERE address_with_erg.walletId="Wallet"."id") AS "erg_str", Count(DISTINCT "TokenId"."token_id") AS "token_count" FROM "wallet" "Wallet" LEFT JOIN "address_with_erg" "Address" ON "Address"."walletId"="Wallet"."id"  LEFT JOIN "address_token_id" "TokenId" ON "TokenId"."id"="Address"."id" GROUP BY "Wallet"."id";

CREATE VIEW "wallet_tx" AS SELECT "Tx"."id" AS "id", "Tx"."tx_id" AS "tx_id", "Tx"."height" AS "height", "Tx"."network_type" AS "network_type", "Tx"."date" AS "date", "Tx"."status" AS "status", "Tx"."json" AS "json", "CreateAddress"."walletId" AS "create_wallet_id", "SpentAddress"."walletId" AS "spent_wallet_id", (SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.txId = "Tx"."id") AS "create_erg_str", (SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.spendTxId = "Tx"."id") AS "spent_erg_str" FROM "tx" "Tx" LEFT JOIN "box" "CreateBox" ON "CreateBox"."txId" = "Tx"."id"  LEFT JOIN "address" "CreateAddress" ON "CreateAddress"."id"="CreateBox"."addressId"  LEFT JOIN "box" "SpentBox" ON "SpentBox"."spendTxId" = "Tx"."id"  LEFT JOIN "address" "SpentAddress" ON "SpentAddress"."id"="SpentBox"."addressId" GROUP BY "Tx"."id" ORDER BY date DESC;

CREATE VIEW "token_with_address" AS SELECT "BoxContent"."token_id" AS "token_id", "Address"."id" AS "address_id", CAST(SUM(CAST("BoxContent"."amount" AS INT)) AS TEXT) AS "amount_str", "Address"."walletId" AS "wallet_id" FROM "box_content" "BoxContent" INNER JOIN "box" "Box" ON "Box"."id" = "BoxContent"."boxId"  INNER JOIN "address" "Address" ON "Box"."addressId" = "Address"."id" WHERE "Box"."spendTxId" IS NULL GROUP BY address_id, token_id, wallet_id;

COMMIT;
`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `
BEGIN TRANSACTION
DROP VIEW IF EXISTS "token_with_address";
DROP VIEW IF EXISTS "wallet_tx";
DROP VIEW IF EXISTS "wallet_with_erg";
DROP VIEW IF EXISTS "address_token_id";
DROP VIEW IF EXISTS "address_with_erg";
DROP TABLE IF EXISTS "box_content";
DROP TABLE IF EXISTS "box";
DROP TABLE IF EXISTS "address";
DROP TABLE IF EXISTS "wallet";
DROP TABLE IF EXISTS "asset";
DROP TABLE IF EXISTS "tx";
DROP TABLE IF EXISTS "block";
COMMIT`;
        await queryRunner.query(sql);
    }

}
