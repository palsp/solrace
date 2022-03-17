import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGarageNullableConstraint1647531691067 implements MigrationInterface {
    name = 'AddGarageNullableConstraint1647531691067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "garage" ALTER COLUMN "mintTokenAccount" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "garage" ALTER COLUMN "garage_token_account" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "garage" ALTER COLUMN "garage_token_account" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "garage" ALTER COLUMN "mintTokenAccount" SET NOT NULL`);
    }

}
