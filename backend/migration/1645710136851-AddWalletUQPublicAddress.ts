import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWalletUQPublicAddress1645710136851 implements MigrationInterface {
    name = 'AddWalletUQPublicAddress1645710136851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "publicAddress" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "UQ_51f1451eae8d19c1321c475eb65" UNIQUE ("publicAddress")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "UQ_51f1451eae8d19c1321c475eb65"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "publicAddress"`);
    }

}
