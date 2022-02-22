import { MigrationInterface, QueryRunner } from "typeorm";

export class boxContent1645511268668 implements MigrationInterface {
    name = "boxContent1645511268668";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sql = `CREATE TABLE "box_content" (
	"id"	integer NOT NULL,
	"token_id"	text NOT NULL,
	"amount"	text NOT NULL,
	"boxId"	integer,
	CONSTRAINT "token_id_in_box" UNIQUE("token_id","boxId"),
	CONSTRAINT "FK_b612cfac8dfbee42efd03697b58" FOREIGN KEY("boxId") REFERENCES "box"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
	PRIMARY KEY("id" AUTOINCREMENT)
);`;
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const sql = `DROP TABLE "box_content";`;
        await queryRunner.query(sql);
    }

}
