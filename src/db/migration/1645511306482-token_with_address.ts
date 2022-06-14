import { MigrationInterface, QueryRunner } from "typeorm";
import { tokenWithAddressQuery } from "./viewsCreationQuery";

export class tokenWithAddress1645511306482 implements MigrationInterface {
    name = "tokenWithAddress1645511306482";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(tokenWithAddressQuery.create);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(tokenWithAddressQuery.drop);
    }

}
