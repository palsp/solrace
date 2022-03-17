import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGarageTable1647531348247 implements MigrationInterface {
    name = 'AddGarageTable1647531348247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "garage" ("id" SERIAL NOT NULL, "base" character varying NOT NULL, "garage" character varying NOT NULL, "door" character varying NOT NULL, "tree" character varying NOT NULL, "success_rate" double precision NOT NULL, "mintTokenAccount" character varying NOT NULL, "staker" character varying, "garage_token_account" character varying NOT NULL, "tokenId" integer, "tokenCollection" uuid, CONSTRAINT "REL_59d260fe479047a29d8023edf3" UNIQUE ("tokenId", "tokenCollection"), CONSTRAINT "PK_64031c73e02f698de3556b51dd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "garage" ADD CONSTRAINT "FK_59d260fe479047a29d8023edf3c" FOREIGN KEY ("tokenId", "tokenCollection") REFERENCES "nft_meta_data"("id","collectionId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "garage" DROP CONSTRAINT "FK_59d260fe479047a29d8023edf3c"`);
        await queryRunner.query(`DROP TABLE "garage"`);
    }

}
