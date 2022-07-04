const addressWithErgQuery = {
    create: `CREATE VIEW "address_with_erg" AS SELECT "Address"."id" AS "id", "Address"."name" AS "name", "Address"."address" AS "address", "Address"."network_type" AS "network_type", "Address"."path" AS "path", "Address"."idx" AS "idx", "Address"."walletId" AS "walletId", (SELECT CAST(SUM(CAST("Box"."erg" AS INT)) AS TEXT) FROM box Box WHERE Box.addressId = "Address"."id" AND Box.spendTxId IS NULL) AS "erg_str", (SELECT COUNT(DISTINCT(BoxContent.token_id)) FROM box_content BoxContent INNER JOIN box Box ON Box.id = BoxContent.boxId WHERE Box.addressId = "Address"."id" AND Box.spendTxId IS NULL) AS "token_count" FROM "address" "Address";`,
    drop: `DROP VIEW "address_with_erg";`
}

const addressTokenIdQuery = {
    create: `CREATE VIEW "address_token_id" AS SELECT "Address"."id" AS "id", "BoxContent"."token_id" AS "token_id" FROM "address" "Address" LEFT JOIN "box" "Box" ON "Box"."addressId"="Address"."id"  LEFT JOIN "box_content" "BoxContent" ON "Box"."id"="BoxContent"."boxId" WHERE "Box"."spendTxId" IS NULL;`,
    drop: `DROP VIEW "address_token_id";`
}

const walletWithErgQuery = {
    create: `CREATE VIEW "wallet_with_erg" AS SELECT "Wallet"."id" AS "id", "Wallet"."name" AS "name", "Wallet"."network_type" AS "network_type", "Wallet"."seed" AS "seed", "Wallet"."extended_public_key" AS "extended_public_key", "Wallet"."type" AS "type", (SELECT CAST(SUM(CAST("address_with_erg"."erg_str" AS INT)) AS TEXT) from address_with_erg WHERE address_with_erg.walletId="Wallet"."id") AS "erg_str", Count(DISTINCT "TokenId"."token_id") AS "token_count" FROM "wallet" "Wallet" LEFT JOIN "address_with_erg" "Address" ON "Address"."walletId"="Wallet"."id"  LEFT JOIN "address_token_id" "TokenId" ON "TokenId"."id"="Address"."id" GROUP BY "Wallet"."id";`,
    drop: `DROP VIEW "wallet_with_erg";`
}

const walletTxQuery = {
    create: `CREATE VIEW "wallet_tx" AS SELECT "Tx"."id" AS "id", "Tx"."tx_id" AS "tx_id", "Tx"."height" AS "height", "Tx"."network_type" AS "network_type", "Tx"."date" AS "date", "Tx"."status" AS "status", "CreateAddress"."walletId" AS "create_wallet_id", "SpentAddress"."walletId" AS "spent_wallet_id", (SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.txId = "Tx"."id") AS "create_erg_str", (SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.spendTxId = "Tx"."id") AS "spent_erg_str" FROM "tx" "Tx" LEFT JOIN "box" "CreateBox" ON "CreateBox"."txId" = "Tx"."id"  LEFT JOIN "address" "CreateAddress" ON "CreateAddress"."id"="CreateBox"."addressId"  LEFT JOIN "box" "SpentBox" ON "SpentBox"."spendTxId" = "Tx"."id"  LEFT JOIN "address" "SpentAddress" ON "SpentAddress"."id"="SpentBox"."addressId" GROUP BY "Tx"."id" ORDER BY date DESC;`,
    drop: `DROP VIEW "wallet_tx";`
}

const tokenWithAddressQuery = {
    create: `CREATE VIEW "token_with_address" AS SELECT "BoxContent"."token_id" AS "token_id", "Address"."id" AS "address_id", CAST(SUM(CAST("BoxContent"."amount" AS INT)) AS TEXT) AS "amount_str", "Address"."walletId" AS "wallet_id" FROM "box_content" "BoxContent" INNER JOIN "box" "Box" ON "Box"."id" = "BoxContent"."boxId"  INNER JOIN "address" "Address" ON "Box"."addressId" = "Address"."id" WHERE "Box"."spendTxId" IS NULL GROUP BY address_id, token_id, wallet_id;`,
    drop: `DROP VIEW "token_with_address";`
}

const AssetCountBoxesQuery = {
    create: `CREATE VIEW "asset_count_boxes" AS SELECT "Box"."id" AS "id", "Box"."asset_count" AS "total", COUNT("BoxContent"."id") AS "inserted" FROM "box" "Box" LEFT OUTER JOIN "box_content" "BoxContent" ON "Box"."id" = "BoxContent"."boxId" GROUP BY "Box"."id"`,
    drop: `DROP VIEW "asset_count_boxes";`
}

export {
    addressWithErgQuery,
    addressTokenIdQuery,
    walletWithErgQuery,
    walletTxQuery,
    tokenWithAddressQuery,
    AssetCountBoxesQuery
}