import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { MedicalRecord } from '../records/entities/medical-record.entity';
import { Medication } from '../medications/entities/medication.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { PrescriptionItem } from '../prescriptions/entities/prescription-item.entity';
import { Consultation } from '../consultations/entities/consultation.entity';

export const appDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST ?? 'prontuario-free.c4xymsikm52a.us-east-1.rds.amazonaws.com',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'casa1397',
  database: process.env.DB_NAME ?? 'postgres',
  ssl: false,
  synchronize: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  entities: [
    User,
    Patient,
    MedicalRecord,
    Medication,
    Appointment,
    Prescription,
    PrescriptionItem,
    Consultation
  ],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  namingStrategy: new SnakeNamingStrategy()
});

export default appDataSource;
