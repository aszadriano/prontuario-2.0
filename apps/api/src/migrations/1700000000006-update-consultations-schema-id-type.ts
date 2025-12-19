import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateConsultationsSchemaIdType1700000000006 implements MigrationInterface {
  name = 'UpdateConsultationsSchemaIdType1700000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "consultations"
      ALTER COLUMN "schema_id"
      TYPE varchar
      USING "schema_id"::text
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "consultations"
      ALTER COLUMN "schema_id"
      TYPE uuid
      USING "schema_id"::uuid
    `);
  }
}
