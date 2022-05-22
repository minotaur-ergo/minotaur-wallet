import { MigrationInterface, QueryRunner } from "typeorm";

export class addressTokenId1645511287133 implements MigrationInterface {
    name = "addressTokenId1645511287133";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE VIEW "address_token_id" AS SELECT "Address"."id" AS "id", "BoxContent"."token_id" AS "token_id" FROM "address" "Address" LEFT JOIN "box" "Box" ON "Box"."addressId"="Address"."id"  LEFT JOIN "box_content" "BoxContent" ON "Box"."id"="BoxContent"."boxId" WHERE "Box"."spendTxId" IS NULL;`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP VIEW "address_token_id";`;
        await queryRunner.query(sql);
    }

}
