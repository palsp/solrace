import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1645718969024 implements MigrationInterface {
    name = 'Init1645718969024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nft_collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "symbol" text NOT NULL, "name" text NOT NULL, "family" text, "publicAddress" text, CONSTRAINT "UQ_abbd9e08596d903a2bbf747c6b1" UNIQUE ("name"), CONSTRAINT "PK_ffe58aa05707db77c2f20ecdbc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nft_meta_data" ("id" integer NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "seller_fee_basis_points" integer NOT NULL, "image" text NOT NULL, "external_url" character varying NOT NULL, "edition" integer NOT NULL, "symbol" text NOT NULL, "attributes" text NOT NULL, "files" text NOT NULL, "creators" text NOT NULL, "collectionId" uuid NOT NULL, CONSTRAINT "PK_3ff306b59542d63648809cf83d1" PRIMARY KEY ("id", "collectionId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" text, "password" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "publicAddress" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_51f1451eae8d19c1321c475eb65" UNIQUE ("publicAddress"), CONSTRAINT "REL_35472b1fe48b6330cd34970956" UNIQUE ("userId"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_nonce" ("id" SERIAL NOT NULL, "nonce" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_bd101958d8476c4b2ed8f7fc5d" UNIQUE ("userId"), CONSTRAINT "PK_0b89bbdd7ebd83cd1f9b270297b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" ADD CONSTRAINT "FK_8f32ce321132160fe7bc73a7b98" FOREIGN KEY ("collectionId") REFERENCES "nft_collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_nonce" ADD CONSTRAINT "FK_bd101958d8476c4b2ed8f7fc5d8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_nonce" DROP CONSTRAINT "FK_bd101958d8476c4b2ed8f7fc5d8"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "nft_meta_data" DROP CONSTRAINT "FK_8f32ce321132160fe7bc73a7b98"`);
        await queryRunner.query(`DROP TABLE "user_nonce"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "nft_meta_data"`);
        await queryRunner.query(`DROP TABLE "nft_collection"`);
    }

}
