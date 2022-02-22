import { MigrationInterface, QueryRunner } from "typeorm";

export class walletWithErg1645511292840 implements MigrationInterface {
    name = "walletWithErg1645511292840";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE VIEW "wallet_with_erg" AS SELECT "Wallet"."id" AS "id", "Wallet"."name" AS "name", "Wallet"."network_type" AS "network_type", "Wallet"."seed" AS "seed", "Wallet"."extended_public_key" AS "extended_public_key", "Wallet"."type" AS "type", (SELECT CAST(SUM(CAST("address_with_erg"."erg_str" AS INT)) AS TEXT) from address_with_erg WHERE address_with_erg.walletId="Wallet"."id") AS "erg_str", Count(DISTINCT "TokenId"."token_id") AS "token_count" FROM "wallet" "Wallet" LEFT JOIN "address_with_erg" "Address" ON "Address"."walletId"="Wallet"."id"  LEFT JOIN "address_token_id" "TokenId" ON "TokenId"."id"="Address"."id" GROUP BY "Wallet"."id";`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP VIEW "wallet_with_erg";`;
        await queryRunner.query(sql);
    }

}
