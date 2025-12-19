import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { MedicalRecord } from '../records/entities/medical-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Appointment, Prescription, MedicalRecord])],
  providers: [PatientsService, JwtAuthGuard, RolesGuard],
  controllers: [PatientsController]
})
export class PatientsModule {}
