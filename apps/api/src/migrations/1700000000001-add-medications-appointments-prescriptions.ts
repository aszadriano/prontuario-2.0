import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMedicationsAppointmentsPrescriptions1700000000001 implements MigrationInterface {
  name = 'AddMedicationsAppointmentsPrescriptions1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create medications table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(180) NOT NULL,
        "generic_name" character varying(180) NOT NULL,
        "concentration" character varying(100) NOT NULL,
        "form" character varying NOT NULL DEFAULT 'tablet',
        "manufacturer" character varying(180),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_medications" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "medications_name_idx" ON "medications" ("name")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "medications_generic_name_idx" ON "medications" ("generic_name")
    `);

    // Create appointments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "appointments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "patient_id" uuid NOT NULL,
        "date_time" TIMESTAMP WITH TIME ZONE NOT NULL,
        "status" character varying NOT NULL DEFAULT 'scheduled',
        "notes" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "appointments_date_time_idx" ON "appointments" ("date_time")
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_appointments_patient'
        ) THEN
          ALTER TABLE "appointments" ADD CONSTRAINT "FK_appointments_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END$$;
    `);


    // Create prescriptions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "prescriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "patient_id" uuid NOT NULL,
        "status" character varying NOT NULL DEFAULT 'draft',
        "notes" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_prescriptions" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_prescriptions_patient'
        ) THEN
          ALTER TABLE "prescriptions" ADD CONSTRAINT "FK_prescriptions_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END$$;
    `);


    // Create prescription_items table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "prescription_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "prescription_id" uuid NOT NULL,
        "medication_id" uuid NOT NULL,
        "dosage" character varying(100) NOT NULL,
        "frequency" character varying(100) NOT NULL,
        "duration" character varying(100) NOT NULL,
        "instructions" text,
        "quantity" integer,
        CONSTRAINT "PK_prescription_items" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_prescription_items_prescription'
        ) THEN
          ALTER TABLE "prescription_items" ADD CONSTRAINT "FK_prescription_items_prescription" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_prescription_items_medication'
        ) THEN
          ALTER TABLE "prescription_items" ADD CONSTRAINT "FK_prescription_items_medication" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END$$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP CONSTRAINT "FK_prescription_items_medication"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP CONSTRAINT "FK_prescription_items_prescription"`);
    await queryRunner.query(`ALTER TABLE "prescriptions" DROP CONSTRAINT "FK_prescriptions_patient"`);
    await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_patient"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "prescription_items"`);
    await queryRunner.query(`DROP TABLE "prescriptions"`);
    await queryRunner.query(`DROP INDEX "appointments_date_time_idx"`);
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP INDEX "medications_generic_name_idx"`);
    await queryRunner.query(`DROP INDEX "medications_name_idx"`);
    await queryRunner.query(`DROP TABLE "medications"`);
  }
}
