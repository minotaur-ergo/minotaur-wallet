import { MigrationInterface, QueryRunner } from "typeorm";

export class tokenWithAddress1645511306482 implements MigrationInterface {
    name = "tokenWithAddress1645511306482";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE VIEW "token_with_address" AS SELECT "BoxContent"."token_id" AS "token_id", "Address"."id" AS "address_id", CAST(SUM(CAST("BoxContent"."amount" AS INT)) AS TEXT) AS "amount_str", "Address"."walletId" AS "wallet_id" FROM "box_content" "BoxContent" INNER JOIN "box" "Box" ON "Box"."id" = "BoxContent"."boxId"  INNER JOIN "address" "Address" ON "Box"."addressId" = "Address"."id" WHERE "Box"."spendTxId" IS NULL GROUP BY address_id, token_id, wallet_id;`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP VIEW "token_with_address";`;
        await queryRunner.query(sql);
    }

}
