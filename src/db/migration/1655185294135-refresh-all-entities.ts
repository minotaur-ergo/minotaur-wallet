import { MigrationInterface, QueryRunner } from 'typeorm';

export class refreshAllEntities1655185294135 implements MigrationInterface {
  name = 'refreshAllEntities1655185294135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const deleting_tables_content = ['box_content', 'box', 'tx', 'block'];
    for (let table of deleting_tables_content) {
      const sql = `DELETE from ${table}`;
      await queryRunner.query(sql);
    }
    // const addressQuery = "UPDATE address SET process_height=0";
    // await queryRunner.query(addressQuery);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
