import { MigrationInterface, QueryRunner } from "typeorm";
import {
    addressTokenIdQuery,
    addressWithErgQuery,
    tokenWithAddressQuery,
    walletTxQuery,
    walletWithErgQuery
} from "./viewsCreationQuery";

export class deleteViews1655183401851 implements MigrationInterface {
    name = "deleteViews1655183401851";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(tokenWithAddressQuery.drop)
        await queryRunner.query(walletTxQuery.drop)
        await queryRunner.query(walletWithErgQuery.drop)
        await queryRunner.query(addressTokenIdQuery.drop)
        await queryRunner.query(addressWithErgQuery.drop)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(addressWithErgQuery.create)
        await queryRunner.query(addressTokenIdQuery.create)
        await queryRunner.query(walletWithErgQuery.create)
        await queryRunner.query(walletTxQuery.create)
        await queryRunner.query(tokenWithAddressQuery.create)
    }

}