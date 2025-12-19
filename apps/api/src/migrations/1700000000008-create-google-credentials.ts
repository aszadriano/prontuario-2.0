import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGoogleCredentials1700000000008 implements MigrationInterface {
    name = 'CreateGoogleCredentials1700000000008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "google_credentials" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL UNIQUE,
                "access_token" text NOT NULL,
                "refresh_token" text NOT NULL,
                "expires_at" TIMESTAMPTZ NOT NULL,
                "scope" text NOT NULL,
                "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "google_credentials"
            ADD CONSTRAINT "FK_google_credentials_user"
            FOREIGN KEY ("user_id") REFERENCES "users"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE INDEX "google_credentials_user_id_idx"
            ON "google_credentials" ("user_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "google_credentials_user_id_idx"`);
        await queryRunner.query(`ALTER TABLE "google_credentials" DROP CONSTRAINT "FK_google_credentials_user"`);
        await queryRunner.query(`DROP TABLE "google_credentials"`);
    }
}
