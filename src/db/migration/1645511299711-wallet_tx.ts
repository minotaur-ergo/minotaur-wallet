import { MigrationInterface, QueryRunner } from "typeorm";
import { walletTxQuery } from "./viewsCreationQuery";

export class walletTx1645511299711 implements MigrationInterface {
    name = "walletTx1645511299711";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(walletTxQuery.create);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(walletTxQuery.drop);
    }

}
