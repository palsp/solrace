import {MigrationInterface, QueryRunner} from "typeorm";

export class DropMetaDataSymbol1645719211117 implements MigrationInterface {
    name = 'DropMetaDataSymbol1645719211117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "symbol"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "symbol" text NOT NULL`);
    }

}
