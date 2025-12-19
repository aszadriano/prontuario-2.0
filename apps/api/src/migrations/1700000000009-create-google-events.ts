import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGoogleEvents1700000000009 implements MigrationInterface {
    name = 'CreateGoogleEvents1700000000009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "google_events" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "google_event_id" varchar(255) NOT NULL,
                "summary" varchar(512) NOT NULL,
                "description" text,
                "start_time" TIMESTAMPTZ NOT NULL,
                "end_time" TIMESTAMPTZ NOT NULL,
                "updated_at_google" TIMESTAMPTZ NOT NULL,
                "raw_payload" jsonb NOT NULL,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "google_events"
            ADD CONSTRAINT "FK_google_events_user"
            FOREIGN KEY ("user_id") REFERENCES "users"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE INDEX "google_events_user_id_idx" ON "google_events" ("user_id")
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "google_events_event_user_idx"
            ON "google_events" ("user_id", "google_event_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "google_events_event_user_idx"`);
        await queryRunner.query(`DROP INDEX "google_events_user_id_idx"`);
        await queryRunner.query(`ALTER TABLE "google_events" DROP CONSTRAINT "FK_google_events_user"`);
        await queryRunner.query(`DROP TABLE "google_events"`);
    }
}
