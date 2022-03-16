import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddKartTable1647435746758 implements MigrationInterface {
  name = 'AddKartTable1647435746758'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "kart" ("id" SERIAL NOT NULL, "max_speed" integer NOT NULL, "acceleration" integer NOT NULL, "drift_power_generation_rate" integer NOT NULL, "drift_power_consumption_rate" integer NOT NULL, "handling" integer NOT NULL, "owner" character varying, "mintTokenAccount" character varying, "tokenAccount" character varying, "tokenId" integer, "tokenCollection" uuid, CONSTRAINT "REL_a9c11e71fcf2d512d5ac84db35" UNIQUE ("tokenId", "tokenCollection"), CONSTRAINT "PK_01f2f7b8503ce30b66676aa5557" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "kart" ADD CONSTRAINT "FK_a9c11e71fcf2d512d5ac84db354" FOREIGN KEY ("tokenId", "tokenCollection") REFERENCES "nft_meta_data"("id","collectionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )

    await queryRunner.query(
      `INSERT INTO kart( max_speed, acceleration, drift_power_generation_rate, drift_power_consumption_rate, handling, "tokenId", "tokenCollection") 
       SELECT max_speed, acceleration, drift_power_generation_rate, drift_power_consumption_rate, handling, "tokenId", "tokenCollection" from "nft_attributes" WHERE "tokenCollection"='b284c65e-459f-43be-bdcf-ed59e610d787'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kart" DROP CONSTRAINT "FK_a9c11e71fcf2d512d5ac84db354"`,
    )
    await queryRunner.query(`DROP TABLE "kart"`)
  }
}
