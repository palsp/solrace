import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserNonce1645693962001 implements MigrationInterface {
    name = 'AddUserNonce1645693962001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_nonce" ("id" SERIAL NOT NULL, "nonce" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_bd101958d8476c4b2ed8f7fc5d" UNIQUE ("userId"), CONSTRAINT "PK_0b89bbdd7ebd83cd1f9b270297b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_nonce" ADD CONSTRAINT "FK_bd101958d8476c4b2ed8f7fc5d8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_nonce" DROP CONSTRAINT "FK_bd101958d8476c4b2ed8f7fc5d8"`);
        await queryRunner.query(`DROP TABLE "user_nonce"`);
    }

}
