import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1645689949360 implements MigrationInterface {
    name = 'Init1645689949360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nft_meta_data" ("id" integer NOT NULL, "name" text NOT NULL, "symbol" text NOT NULL, "attributes" text NOT NULL, "files" text NOT NULL, "creators" text NOT NULL, "collectionId" uuid NOT NULL, CONSTRAINT "PK_3ff306b59542d63648809cf83d1" PRIMARY KEY ("id", "collectionId"))`);
        await queryRunner.query(`CREATE TABLE "nft_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "family" text NOT NULL, CONSTRAINT "UQ_abbd9e08596d903a2bbf747c6b1" UNIQUE ("name"), CONSTRAINT "PK_ffe58aa05707db77c2f20ecdbc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD CONSTRAINT "FK_8f32ce321132160fe7bc73a7b98" FOREIGN KEY ("collectionId") REFERENCES "nft_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP CONSTRAINT "FK_8f32ce321132160fe7bc73a7b98"`);
        await queryRunner.query(`DROP TABLE "nft_collection"`);
        await queryRunner.query(`DROP TABLE "nft_meta_data"`);
    }

}
