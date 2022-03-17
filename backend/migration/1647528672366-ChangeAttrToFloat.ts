import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeAttrToFloat1647528672366 implements MigrationInterface {
    name = 'ChangeAttrToFloat1647528672366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kart" DROP COLUMN "drift_power_generation_rate"`);
        await queryRunner.query(`ALTER TABLE "kart" ADD "drift_power_generation_rate" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "kart" DROP COLUMN "drift_power_consumption_rate"`);
        await queryRunner.query(`ALTER TABLE "kart" ADD "drift_power_consumption_rate" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kart" DROP COLUMN "drift_power_consumption_rate"`);
        await queryRunner.query(`ALTER TABLE "kart" ADD "drift_power_consumption_rate" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "kart" DROP COLUMN "drift_power_generation_rate"`);
        await queryRunner.query(`ALTER TABLE "kart" ADD "drift_power_generation_rate" integer NOT NULL`);
    }

}
