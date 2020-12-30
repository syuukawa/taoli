import {MigrationInterface, QueryRunner} from "typeorm";

export class createPriceTable1609315230149 implements MigrationInterface {
    name = 'createPriceTable1609315230149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prices" ("id" SERIAL NOT NULL, "token0" character varying NOT NULL, "token1" character varying NOT NULL, "midPrice" double precision NOT NULL, "invertMidPrice" double precision NOT NULL, "timestamp" integer NOT NULL, CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "prices"`);
    }

}
