import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCollectionCreator1647267046840 implements MigrationInterface {
  name = 'AddCollectionCreator1647267046840'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft_collection" RENAME COLUMN "publicAddress" TO "expected_creator_address"`,
    )

    await queryRunner.query(
      `ALTER TABLE "nft_collection" ADD "candy_machine_id" text`,
    )

    await queryRunner.query(
      `ALTER TABLE "nft_collection" ADD "base_image_uri" text`,
    )

    await queryRunner.query(
      `UPDATE "nft_collection" SET "base_image_uri" = 'https://sol-race.s3.ap-southeast-1.amazonaws.com'`,
    )

    await queryRunner.query(
      `ALTER TABLE "nft_collection" ALTER COLUMN "base_image_uri" SET NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nft_collection" DROP COLUMN "base_image_uri"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nft_collection" DROP COLUMN "candy_machine_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "nft_collection" RENAME COLUMN "expected_creator_address" TO "publicAddress"`,
    )
  }
}
