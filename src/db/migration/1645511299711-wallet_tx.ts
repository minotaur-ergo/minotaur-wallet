import { MigrationInterface, QueryRunner } from "typeorm";

export class walletTx1645511299711 implements MigrationInterface {
    name = "walletTx1645511299711";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE VIEW "wallet_tx" AS SELECT "Tx"."id" AS "id", "Tx"."tx_id" AS "tx_id", "Tx"."height" AS "height", "Tx"."network_type" AS "network_type", "Tx"."date" AS "date", "Tx"."status" AS "status", "Tx"."json" AS "json", "CreateAddress"."walletId" AS "create_wallet_id", "SpentAddress"."walletId" AS "spent_wallet_id", (SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.txId = "Tx"."id") AS "create_erg_str", (SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.spendTxId = "Tx"."id") AS "spent_erg_str" FROM "tx" "Tx" LEFT JOIN "box" "CreateBox" ON "CreateBox"."txId" = "Tx"."id"  LEFT JOIN "address" "CreateAddress" ON "CreateAddress"."id"="CreateBox"."addressId"  LEFT JOIN "box" "SpentBox" ON "SpentBox"."spendTxId" = "Tx"."id"  LEFT JOIN "address" "SpentAddress" ON "SpentAddress"."id"="SpentBox"."addressId" GROUP BY "Tx"."id" ORDER BY date DESC;`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP VIEW "wallet_tx";`;
        await queryRunner.query(sql);
    }

}
