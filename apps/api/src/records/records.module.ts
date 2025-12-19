import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { Patient } from '../patients/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Patient, User])],
  providers: [RecordsService, JwtAuthGuard, RolesGuard],
  controllers: [RecordsController]
})
export class RecordsModule {}
