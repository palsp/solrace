import {MigrationInterface, QueryRunner} from "typeorm";

export class AddKartModelAttr1647525071642 implements MigrationInterface {
    name = 'AddKartModelAttr1647525071642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kart" ADD "model" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kart" DROP COLUMN "model"`);
    }

}
