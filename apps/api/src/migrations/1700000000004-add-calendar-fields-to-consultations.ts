import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalendarFieldsToConsultations1700000000004 implements MigrationInterface {
    name = 'AddCalendarFieldsToConsultations1700000000004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "consultations" 
            ADD COLUMN "doctor_id" uuid NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "consultations" 
            ADD COLUMN "google_event_id" varchar
        `);
        
        await queryRunner.query(`
            ALTER TABLE "consultations" 
            ADD CONSTRAINT "FK_consultations_doctor_id" 
            FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_consultations_doctor_id" ON "consultations" ("doctor_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_consultations_doctor_id"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_consultations_doctor_id"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "google_event_id"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP COLUMN "doctor_id"`);
    }
}
