import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { AppointmentResponseDto, PaginatedAppointmentsResponseDto } from './dto/appointment-response.dto';
import { PaginationMetaDto } from '../patients/dto/patient-response.dto';
import { User } from '../users/entities/user.entity';
import { GoogleCalendarSyncService } from '../google/google-calendar-sync.service';
import { GoogleAuthService } from '../google/google-auth.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly googleCalendarSyncService: GoogleCalendarSyncService,
    private readonly googleAuthService: GoogleAuthService
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, user: User): Promise<AppointmentResponseDto> {
    try {
      console.log('Creating appointment with data:', createAppointmentDto);
      console.log('Current user:', user);
      
      // Validate required fields
      if (!createAppointmentDto.patientId) {
        throw new Error('Patient ID is required');
      }
      if (!createAppointmentDto.dateTime) {
        throw new Error('Date and time is required');
      }

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        doctorId: user.id, // Usar o ID do usuário logado como médico
        dateTime: new Date(createAppointmentDto.dateTime),
        status: createAppointmentDto.status || 'scheduled'
      });
      
      console.log('Created appointment entity:', appointment);
      
      const savedAppointment = await this.appointmentRepository.save(appointment);
      console.log('Saved appointment:', savedAppointment);

      const appointmentWithRelations = await this.appointmentRepository.findOne({
        where: { id: savedAppointment.id },
        relations: ['patient']
      });

      if (appointmentWithRelations) {
        await this.syncGoogleCalendarEvent(appointmentWithRelations, user);
      }
      
      return this.toResponseDto(appointmentWithRelations ?? savedAppointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  private buildGoogleEventPayload(appointment: Appointment, doctor: User) {
    const patient = appointment.patient;
    const patientName = patient ? patient.fullName : 'Paciente';
    const patientContact = patient?.phone || patient?.email || '';
    const endTime = new Date(appointment.dateTime);
    endTime.setHours(endTime.getHours() + 1);

    return {
      summary: `Consulta - ${patientName}`,
      description: `Médico: ${doctor.name}\nPaciente: ${patientName}\nContato: ${patientContact}\nObservações: ${appointment.notes || 'Consulta médica'}`,
      start: {
        dateTime: appointment.dateTime.toISOString(),
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Sao_Paulo'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };
  }

  private async syncGoogleCalendarEvent(
    appointment: Appointment,
    doctorOverride?: User
  ): Promise<void> {
    const doctor =
      doctorOverride ??
      (await this.userRepository.findOne({ where: { id: appointment.doctorId } }));
    if (!doctor?.id) {
      console.info('Consulta sem médico associado para sincronizar com o Google Calendar.');
      return;
    }

    const hasCreds = await this.googleAuthService.hasCredentials(doctor.id);
    if (!hasCreds) {
      console.info(`Usuário ${doctor.id} não conectou o Google Calendar - ignorando sincronização.`);
      return;
    }

    const payload = this.buildGoogleEventPayload(appointment, doctor);

    if (!appointment.googleEventId) {
      await this.createGoogleEventForAppointment(appointment, doctor, payload);
      return;
    }

    try {
      await this.googleCalendarSyncService.updateEventForUser(
        doctor.id,
        appointment.googleEventId,
        payload
      );
    } catch (error) {
      console.error(
        `Falha ao atualizar evento do Google Calendar ${appointment.googleEventId}, tentando recriar.`,
        error
      );
      await this.createGoogleEventForAppointment(appointment, doctor, payload);
    }
  }

  private async createGoogleEventForAppointment(
    appointment: Appointment,
    doctor: User,
    payload: ReturnType<AppointmentsService['buildGoogleEventPayload']>
  ) {
    try {
      const googleEvent = await this.googleCalendarSyncService.createEventForUser(
        doctor.id,
        payload
      );
      if (googleEvent?.id) {
        appointment.googleEventId = googleEvent.id;
        await this.appointmentRepository.update(appointment.id, {
          googleEventId: googleEvent.id
        });
      }
    } catch (error) {
      console.error('Falha ao criar evento no Google Calendar', error);
    }
  }

  async findAll(query: QueryAppointmentsDto): Promise<PaginatedAppointmentsResponseDto> {
    const { page, limit, patientId, status, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient');

    if (patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', { patientId });
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    if (dateFrom && dateTo) {
      console.log('Filtering appointments by date range:', { dateFrom, dateTo });
      const dateFromObj = new Date(dateFrom);
      const dateToObj = new Date(dateTo);
      console.log('Parsed dates:', { dateFromObj, dateToObj });
      
      queryBuilder.andWhere('appointment.dateTime BETWEEN :dateFrom AND :dateTo', {
        dateFrom: dateFromObj,
        dateTo: dateToObj
      });
    } else if (dateFrom) {
      console.log('Filtering appointments from date:', dateFrom);
      queryBuilder.andWhere('appointment.dateTime >= :dateFrom', {
        dateFrom: new Date(dateFrom)
      });
    } else if (dateTo) {
      console.log('Filtering appointments to date:', dateTo);
      queryBuilder.andWhere('appointment.dateTime <= :dateTo', {
        dateTo: new Date(dateTo)
      });
    }

    const [appointments, total] = await queryBuilder
      .orderBy('appointment.dateTime', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const meta: PaginationMetaDto = {
      itemCount: appointments.length,
      totalItems: total,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };

    return {
      items: appointments.map(appointment => this.toResponseDto(appointment)),
      meta
    };
  }

  async findOne(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient']
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return this.toResponseDto(appointment);
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient']
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    Object.assign(appointment, {
      ...updateAppointmentDto,
      ...(updateAppointmentDto.dateTime && { dateTime: new Date(updateAppointmentDto.dateTime) })
    });
    
    const savedAppointment = await this.appointmentRepository.save(appointment);
    await this.syncGoogleCalendarEvent(savedAppointment);
    return this.toResponseDto(savedAppointment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }

  private toResponseDto(appointment: Appointment): AppointmentResponseDto {
    return {
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      dateTime: appointment.dateTime,
      status: appointment.status,
      notes: appointment.notes,
      googleEventId: appointment.googleEventId,
      patient: appointment.patient
        ? {
          id: appointment.patient.id,
          fullName: appointment.patient.fullName,
          birthDate: appointment.patient.birthDate,
          documentId: appointment.patient.documentId,
          rg: appointment.patient.rg,
          gender: appointment.patient.gender,
          maritalStatus: appointment.patient.maritalStatus,
          phone: appointment.patient.phone ?? null,
          whatsapp: appointment.patient.whatsapp ?? null,
          email: appointment.patient.email ?? null,
          profession: appointment.patient.profession,
          addressJson: appointment.patient.addressJson ?? null,
          emergencyContact: appointment.patient.emergencyContact ?? null,
          createdAt: appointment.patient.createdAt,
          updatedAt: appointment.patient.updatedAt
        }
        : undefined,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };
  }
}
