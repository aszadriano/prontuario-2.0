import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPatientExtraFields1700000000007 implements MigrationInterface {
  name = 'AddPatientExtraFields1700000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" ADD "rg" character varying(40) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "gender" character varying(20) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "marital_status" character varying(30) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "whatsapp" character varying(40)`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "profession" character varying(120) NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "patients" ADD "emergency_contact" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "emergency_contact"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "profession"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "whatsapp"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "marital_status"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "rg"`);
  }
}
