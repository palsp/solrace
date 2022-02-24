import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMetadaOtionalAttributes1645690414709 implements MigrationInterface {
    name = 'AddMetadaOtionalAttributes1645690414709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "seller_fee_basis_points" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "image" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "external_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "edition" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "edition"`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "external_url"`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "seller_fee_basis_points"`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "description"`);
    }

}
