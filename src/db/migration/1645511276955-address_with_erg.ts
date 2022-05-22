import { MigrationInterface, QueryRunner } from "typeorm";

export class addressWithErg1645511276955 implements MigrationInterface {
    name = "addressWithErg1645511276955";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE VIEW "address_with_erg" AS SELECT "Address"."id" AS "id", "Address"."name" AS "name", "Address"."address" AS "address", "Address"."network_type" AS "network_type", "Address"."path" AS "path", "Address"."idx" AS "idx", "Address"."walletId" AS "walletId", (SELECT CAST(SUM(CAST("Box"."erg" AS INT)) AS TEXT) FROM box Box WHERE Box.addressId = "Address"."id" AND Box.spendTxId IS NULL) AS "erg_str", (SELECT COUNT(DISTINCT(BoxContent.token_id)) FROM box_content BoxContent INNER JOIN box Box ON Box.id = BoxContent.boxId WHERE Box.addressId = "Address"."id" AND Box.spendTxId IS NULL) AS "token_count" FROM "address" "Address";`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP VIEW "address_with_erg";`;
        await queryRunner.query(sql);
    }

}
