import { MigrationInterface, QueryRunner } from 'typeorm';

export class cleanupMultiSigData1697532775886 implements MigrationInterface {
  name = 'cleanupMultiSigData1697532775886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'multi-signer',
      'multi-sign-input',
      'multi-sign-tx',
      'multi-commitment',
      'multi-sign-row',
    ];
    for (const table of tables) {
      await queryRunner.query(`DELETE FROM '${table}'`);
    }
  }

  public async down(): Promise<void> {
    // no down method
  }
}
