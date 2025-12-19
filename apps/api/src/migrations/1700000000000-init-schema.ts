import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
        ) THEN
          CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MEDICO', 'SECRETARIA');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(120) NOT NULL,
        "email" varchar(160) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "users_email_uq" ON "users" ("email");`
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "patients" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "full_name" varchar(180) NOT NULL,
        "birth_date" date NOT NULL,
        "document_id" varchar(40) NOT NULL,
        "phone" varchar(40),
        "email" varchar(160),
        "address_json" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "patients_full_name_idx" ON "patients" ("full_name");`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "patients_document_id_idx" ON "patients" ("document_id");`
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medical_records" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "summary" text NOT NULL,
        "notes" jsonb,
        "tags" text[] NOT NULL DEFAULT ARRAY[]::text[],
        "doctor_id" uuid NOT NULL,
        "patient_id" uuid NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "fk_medical_records_doctor" FOREIGN KEY ("doctor_id") REFERENCES "users" ("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_medical_records_patient" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "medical_records";');
    await queryRunner.query('DROP INDEX IF EXISTS "patients_document_id_idx";');
    await queryRunner.query('DROP INDEX IF EXISTS "patients_full_name_idx";');
    await queryRunner.query('DROP TABLE IF EXISTS "patients";');
    await queryRunner.query('DROP INDEX IF EXISTS "users_email_uq";');
    await queryRunner.query('DROP TABLE IF EXISTS "users";');
    await queryRunner.query('DROP TYPE IF EXISTS "public"."users_role_enum";');
  }
}

