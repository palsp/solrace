import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNFTAttributesTable1646110258429 implements MigrationInterface {
    name = 'AddNFTAttributesTable1646110258429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nft_attributes" ("id" SERIAL NOT NULL, "max_speed" integer NOT NULL, "acceleration" integer NOT NULL, "drift_power_generation_rate" integer NOT NULL, "drift_power_consumption_rate" integer NOT NULL, "handling" integer NOT NULL, "tokenId" integer, "tokenCollection" uuid, CONSTRAINT "REL_77648ef355d4fcccecfdfb6dd4" UNIQUE ("tokenId", "tokenCollection"), CONSTRAINT "PK_5e0cdf3bc455340750e98aaaa56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP COLUMN "attributes"`);
        await queryRunner.query(`ALTER TABLE "nft_attributes" ADD CONSTRAINT "FK_77648ef355d4fcccecfdfb6dd4e" FOREIGN KEY ("tokenId", "tokenCollection") REFERENCES "nft_meta_data"("id","collectionId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft_attributes" DROP CONSTRAINT "FK_77648ef355d4fcccecfdfb6dd4e"`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD "attributes" text NOT NULL`);
        await queryRunner.query(`DROP TABLE "nft_attributes"`);
    }

}
