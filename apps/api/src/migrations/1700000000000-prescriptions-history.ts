import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrescriptionsHistory1700000000000 implements MigrationInterface {
  name = 'PrescriptionsHistory1700000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ensure uuid extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    // prescriptions table columns
    await queryRunner.query(`ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "prescriber_id" uuid`);
    await queryRunner.query(`ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "reason_for_change" text`);
    await queryRunner.query(`ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "version" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "valid_from" date`);
    await queryRunner.query(`ALTER TABLE "prescriptions" ADD COLUMN IF NOT EXISTS "valid_until" date`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "prescriptions_patient_id_idx" ON "prescriptions" ("patient_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "prescriptions_created_at_idx" ON "prescriptions" ("created_at")`);

    // Add FK to users if table exists
    await queryRunner.query(`DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE "prescriptions" DROP CONSTRAINT IF EXISTS "prescriptions_prescriber_id_fkey";
        ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_prescriber_id_fkey" FOREIGN KEY ("prescriber_id") REFERENCES "users"("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
      END IF;
    END$$;`);

    // prescription_items new columns
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "medication_name" varchar(180)`);
    await queryRunner.query(`UPDATE "prescription_items" pi SET medication_name = COALESCE(m.name, 'Medicamento') FROM medications m WHERE pi.medication_id = m.id AND (pi.medication_name IS NULL OR pi.medication_name = '')`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ALTER COLUMN "medication_name" SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "route" varchar(100)`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "duration_days" integer`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "start_date" date`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "end_date" date`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "notes" text`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "is_chronic" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "is_prn" boolean NOT NULL DEFAULT false`);

    await queryRunner.query(`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prescription_item_status_enum') THEN
        CREATE TYPE prescription_item_status_enum AS ENUM ('active', 'stopped', 'changed');
      END IF;
    END$$;`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "status" prescription_item_status_enum NOT NULL DEFAULT 'active'`);
    await queryRunner.query(`ALTER TABLE "prescription_items" ADD COLUMN IF NOT EXISTS "replaced_by_item_id" uuid`);

    // allergies table
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "allergies" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "patient_id" uuid NOT NULL,
      "substance" varchar(180) NOT NULL,
      "reaction" varchar(200),
      "severity" varchar(16) NOT NULL DEFAULT 'leve',
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "allergies_patient_id_idx" ON "allergies" ("patient_id")`);

    // prescription_attachments table
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "prescription_attachments" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "prescription_id" uuid NOT NULL,
      "file_url" varchar(500) NOT NULL,
      "label" varchar(180),
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now()
    )`);
    await queryRunner.query(`ALTER TABLE "prescription_attachments" DROP CONSTRAINT IF EXISTS "prescription_attachments_prescription_id_fkey"`);
    await queryRunner.query(`ALTER TABLE "prescription_attachments" ADD CONSTRAINT "prescription_attachments_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "replaced_by_item_id"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "status"`);
    await queryRunner.query(`DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prescription_item_status_enum') THEN
        DROP TYPE prescription_item_status_enum;
      END IF;
    END$$;`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "is_prn"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "is_chronic"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "notes"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "end_date"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "start_date"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "duration_days"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "route"`);
    await queryRunner.query(`ALTER TABLE "prescription_items" DROP COLUMN IF EXISTS "medication_name"`);

    await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "valid_until"`);
    await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "valid_from"`);
    await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "version"`);
    await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "reason_for_change"`);
    await queryRunner.query(`ALTER TABLE "prescriptions" DROP COLUMN IF EXISTS "prescriber_id"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "prescription_attachments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "allergies"`);
  }
}
