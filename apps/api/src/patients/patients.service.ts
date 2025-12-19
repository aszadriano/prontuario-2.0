import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { MedicalRecord } from '../records/entities/medical-record.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientsDto } from './dto/query-patients.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(MedicalRecord)
    private readonly recordRepository: Repository<MedicalRecord>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const existing = await this.patientsRepository.findOne({
      where: { documentId: createPatientDto.documentId }
    });

    if (existing) {
      throw new BadRequestException('Patient with this document already exists');
    }

    const patient = this.patientsRepository.create(createPatientDto);
    return this.patientsRepository.save(patient);
  }

  async findAll(query: QueryPatientsDto): Promise<Pagination<Patient>> {
    const queryBuilder = this.patientsRepository.createQueryBuilder('patient');

    if (query.search) {
      queryBuilder.andWhere(
        '(patient.fullName ILIKE :search OR patient.documentId ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query.documentId) {
      queryBuilder.andWhere('patient.documentId = :documentId', {
        documentId: query.documentId
      });
    }

    queryBuilder.orderBy('patient.createdAt', 'DESC');

    return paginate<Patient>(queryBuilder, {
      page: query.page,
      limit: query.limit
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientsRepository.preload({ id, ...updatePatientDto });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return this.patientsRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    // Ensure exists
    await this.findOne(id);
    // Delete dependents (avoid FK violations)
    await this.appointmentRepository.delete({ patientId: id } as any);
    await this.prescriptionRepository.delete({ patientId: id } as any);
    await this.recordRepository.delete({ patient: { id } } as any);
    // Finally remove the patient
    await this.patientsRepository.delete(id);
  }
}
