import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { RecordsModule } from './records/records.module';
import { MedicationsModule } from './medications/medications.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { DrugInteractionsModule } from './drug-interactions/drug-interactions.module';
import { User } from './users/entities/user.entity';
import { Patient } from './patients/entities/patient.entity';
import { MedicalRecord } from './records/entities/medical-record.entity';
import { Medication } from './medications/entities/medication.entity';
import { Appointment } from './appointments/entities/appointment.entity';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { PrescriptionItem } from './prescriptions/entities/prescription-item.entity';
import { Consultation } from './consultations/entities/consultation.entity';
import { Allergy } from './allergies/entities/allergy.entity';
import { PrescriptionAttachment } from './prescriptions/entities/prescription-attachment.entity';
import { GoogleCredential } from './google/entities/google-credential.entity';
import { GoogleEvent } from './google/entities/google-event.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleModule } from './google/google.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const sslEnabled = configService.get<boolean>('database.ssl') ?? false;
        const sslRejectUnauthorized = configService.get<boolean | undefined>(
          'database.sslRejectUnauthorized'
        );
        const isDev = process.env.NODE_ENV !== 'production';
        const base = {
          type: 'postgres' as const,
          entities: [
            User,
            Patient,
            MedicalRecord,
            Medication,
            Appointment,
            Prescription,
            PrescriptionItem,
            Consultation,
            PrescriptionAttachment,
            GoogleCredential,
            GoogleEvent
          ],
          migrations: isDev ? ['apps/api/src/migrations/[0-9]*.{ts,js}'] : ['dist/migrations/[0-9]*.js'],
          migrationsRun: false,
          synchronize: isDev,
          namingStrategy: new SnakeNamingStrategy(),
          ssl:
            sslEnabled && sslRejectUnauthorized === false
              ? { rejectUnauthorized: false }
              : sslEnabled
        };

        return {
          ...base,
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name')
        };
      },
      inject: [ConfigService]
    }),
    AuthModule,
    UsersModule,
    PatientsModule,
    RecordsModule,
    MedicationsModule,
    AppointmentsModule,
    PrescriptionsModule,
    ConsultationsModule,
    DrugInteractionsModule,
    GoogleModule,
    EventsModule
  ]
})
export class AppModule {}
