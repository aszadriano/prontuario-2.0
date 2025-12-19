import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';
@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>
  ) {}



  async create(createConsultationDto: CreateConsultationDto): Promise<ConsultationResponseDto> {
    try {
      console.log('Creating consultation with data:', createConsultationDto);
      
      // Validate required fields
      if (!createConsultationDto.patientId) {
        throw new Error('Patient ID is required');
      }
      if (!createConsultationDto.doctorId) {
        throw new Error('Doctor ID is required');
      }
      if (!createConsultationDto.schemaId) {
        throw new Error('Schema ID is required');
      }
      if (!createConsultationDto.startTime) {
        throw new Error('Start time is required');
      }
      if (!createConsultationDto.endTime) {
        throw new Error('End time is required');
      }


      const consultation = this.consultationRepository.create({
        ...createConsultationDto,
        startTime: new Date(createConsultationDto.startTime),
        endTime: new Date(createConsultationDto.endTime)
      });
      
      console.log('Created consultation entity:', consultation);
      
      const savedConsultation = await this.consultationRepository.save(consultation);
      console.log('Saved consultation:', savedConsultation);

      
      return this.toResponseDto(savedConsultation);
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw error;
    }
  }

  async findAll(): Promise<ConsultationResponseDto[]> {
    const consultations = await this.consultationRepository.find({
      relations: ['patient'],
      order: { startTime: 'DESC' }
    });
    
    return consultations.map(consultation => this.toResponseDto(consultation));
  }

  async findOne(id: string): Promise<ConsultationResponseDto> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['patient']
    });

    if (!consultation) {
      throw new Error(`Consultation with ID ${id} not found`);
    }

    return this.toResponseDto(consultation);
  }

  async findByPatient(patientId: string): Promise<ConsultationResponseDto[]> {
    const consultations = await this.consultationRepository.find({
      where: { patientId },
      relations: ['patient'],
      order: { startTime: 'DESC' }
    });
    
    return consultations.map(consultation => this.toResponseDto(consultation));
  }

  private toResponseDto(consultation: Consultation): ConsultationResponseDto {
    return {
      id: consultation.id,
      patientId: consultation.patientId,
      appointmentId: consultation.appointmentId,
      doctorId: consultation.doctorId,
      schemaId: consultation.schemaId,
      startTime: consultation.startTime,
      endTime: consultation.endTime,
      durationMinutes: consultation.durationMinutes,
      notes: consultation.notes,
      summary: consultation.summary,
      googleEventId: consultation.googleEventId,
      patient: consultation.patient
        ? {
          id: consultation.patient.id,
          fullName: consultation.patient.fullName,
          birthDate: consultation.patient.birthDate,
          documentId: consultation.patient.documentId,
          rg: consultation.patient.rg,
          gender: consultation.patient.gender,
          maritalStatus: consultation.patient.maritalStatus,
          phone: consultation.patient.phone ?? null,
          whatsapp: consultation.patient.whatsapp ?? null,
          email: consultation.patient.email ?? null,
          profession: consultation.patient.profession,
          addressJson: consultation.patient.addressJson ?? null,
          emergencyContact: consultation.patient.emergencyContact ?? null,
          createdAt: consultation.patient.createdAt,
          updatedAt: consultation.patient.updatedAt
        }
        : undefined,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt
    };
  }
}
