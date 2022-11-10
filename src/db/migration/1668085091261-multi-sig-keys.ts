import { MigrationInterface, QueryRunner } from 'typeorm';

export class multiSigKeys1668085091261 implements MigrationInterface {
  name = 'multiSigKeys1668085091261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `CREATE TABLE "multi_sig_key" (
            "id"    integer NOT NULL,
            "extended_key"    text NOT NULL,
            "walletId"    integer,
            "signWalletId"    integer,
            CONSTRAINT "FK_f8f8c03baf6f0883d0b033f72cd" FOREIGN KEY("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "FK_45e564a88d4a263bb7ddef5897b" FOREIGN KEY("signWalletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`;
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `DROP TABLE "multi_sig_key";`;
    await queryRunner.query(sql);
  }
}
