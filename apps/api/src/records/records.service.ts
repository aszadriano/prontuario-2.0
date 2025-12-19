import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_ROLES } from '@prontuario/shared';
import { MedicalRecord } from './entities/medical-record.entity';
import { Patient } from '../patients/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly recordsRepository: Repository<MedicalRecord>,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(
    patientId: string,
    author: User,
    createRecordDto: CreateRecordDto
  ): Promise<MedicalRecord> {
    if (author.role !== USER_ROLES.MEDICO) {
      throw new ForbiddenException('Only doctors can create medical records');
    }

    const patient = await this.patientsRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctor = await this.usersRepository.findOne({ where: { id: author.id } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const record = this.recordsRepository.create({
      patient,
      doctor,
      summary: createRecordDto.summary,
      notes: createRecordDto.notes ?? null,
      tags: createRecordDto.tags ?? []
    });

    // TODO(part2): incorporate AI-assisted note suggestions before saving.

    return this.recordsRepository.save(record);
  }

  async findAllForPatient(patientId: string): Promise<MedicalRecord[]> {
    const patient = await this.patientsRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return this.recordsRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor', 'patient'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<MedicalRecord> {
    const record = await this.recordsRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient']
    });
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  async update(
    id: string,
    author: User,
    updateRecordDto: UpdateRecordDto
  ): Promise<MedicalRecord> {
    const record = await this.findOne(id);

    if (author.role !== USER_ROLES.ADMIN && record.doctor.id !== author.id) {
      throw new ForbiddenException('You cannot update this medical record');
    }

    Object.assign(record, {
      summary: updateRecordDto.summary ?? record.summary,
      notes: updateRecordDto.notes ?? record.notes,
      tags: updateRecordDto.tags ?? record.tags
    });

    // TODO(part3): emit real-time notifications to chat once chat module arrives.

    return this.recordsRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordsRepository.remove(record);
    // TODO(part3): trigger atestado generation workflow when implemented.
  }
}
