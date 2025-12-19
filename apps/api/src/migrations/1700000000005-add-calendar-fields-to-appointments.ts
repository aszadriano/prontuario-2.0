import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalendarFieldsToAppointments1700000000005 implements MigrationInterface {
    name = 'AddCalendarFieldsToAppointments1700000000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, adicionar a coluna como nullable
        await queryRunner.query(`
            ALTER TABLE "appointments" 
            ADD COLUMN "doctor_id" uuid
        `);
        
        await queryRunner.query(`
            ALTER TABLE "appointments" 
            ADD COLUMN "google_event_id" varchar
        `);
        
        // Buscar um médico padrão para atribuir aos appointments existentes
        const defaultDoctor = await queryRunner.query(`
            SELECT id FROM "users" WHERE role = 'MEDICO' LIMIT 1
        `);
        
        if (defaultDoctor.length > 0) {
            // Atualizar appointments existentes com o médico padrão
            await queryRunner.query(`
                UPDATE "appointments" 
                SET "doctor_id" = $1 
                WHERE "doctor_id" IS NULL
            `, [defaultDoctor[0].id]);
        }
        
        // Agora tornar a coluna NOT NULL
        await queryRunner.query(`
            ALTER TABLE "appointments" 
            ALTER COLUMN "doctor_id" SET NOT NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE "appointments" 
            ADD CONSTRAINT "FK_appointments_doctor_id" 
            FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_appointments_doctor_id" ON "appointments" ("doctor_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_appointments_doctor_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_doctor_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "google_event_id"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "doctor_id"`);
    }
}
