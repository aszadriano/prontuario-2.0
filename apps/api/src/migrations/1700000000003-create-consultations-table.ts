import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsultationsTable1700000000003 implements MigrationInterface {
  name = 'CreateConsultationsTable1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "consultations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "patient_id" uuid NOT NULL,
        "appointment_id" uuid,
        "schema_id" character varying NOT NULL,
        "start_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "end_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "duration_minutes" integer NOT NULL,
        "notes" jsonb NOT NULL,
        "summary" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_consultations" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "consultations_start_time_idx" ON "consultations" ("start_time")
    `);

    await queryRunner.query(`
      CREATE INDEX "consultations_patient_id_idx" ON "consultations" ("patient_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "consultations_appointment_id_idx" ON "consultations" ("appointment_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "consultations" 
      ADD CONSTRAINT "FK_consultations_patient" 
      FOREIGN KEY ("patient_id") 
      REFERENCES "patients"("id") 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "consultations" 
      ADD CONSTRAINT "FK_consultations_appointment" 
      FOREIGN KEY ("appointment_id") 
      REFERENCES "appointments"("id") 
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_consultations_appointment"`);
    await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_consultations_patient"`);
    await queryRunner.query(`DROP INDEX "consultations_appointment_id_idx"`);
    await queryRunner.query(`DROP INDEX "consultations_patient_id_idx"`);
    await queryRunner.query(`DROP INDEX "consultations_start_time_idx"`);
    await queryRunner.query(`DROP TABLE "consultations"`);
  }
}
