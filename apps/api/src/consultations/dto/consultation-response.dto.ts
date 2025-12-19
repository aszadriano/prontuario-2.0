import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PatientResponseDto } from '../../patients/dto/patient-response.dto';

export class ConsultationResponseDto {
  @ApiProperty({ description: 'ID da consulta' })
  id!: string;

  @ApiProperty({ description: 'ID do paciente' })
  patientId!: string;

  @ApiPropertyOptional({ description: 'ID do agendamento relacionado' })
  appointmentId?: string;

  @ApiProperty({ description: 'ID do médico responsável pela consulta' })
  doctorId!: string;

  @ApiProperty({ description: 'ID do schema usado' })
  schemaId!: string;

  @ApiProperty({ description: 'Data e hora de início da consulta' })
  startTime!: Date;

  @ApiProperty({ description: 'Data e hora de fim da consulta' })
  endTime!: Date;

  @ApiProperty({ description: 'Duração da consulta em minutos' })
  durationMinutes!: number;

  @ApiProperty({ description: 'Anotações da consulta em formato JSON' })
  notes!: any;

  @ApiPropertyOptional({ description: 'Resumo da consulta' })
  summary?: string;

  @ApiPropertyOptional({ description: 'ID do evento no Google Calendar' })
  googleEventId?: string;

  @ApiPropertyOptional({ description: 'Dados do paciente', type: PatientResponseDto })
  patient?: PatientResponseDto;

  @ApiProperty({ description: 'Data de criação' })
  createdAt!: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt!: Date;
}

export class PaginatedConsultationsResponseDto {
  @ApiProperty({ description: 'Lista de consultas', type: [ConsultationResponseDto] })
  items!: ConsultationResponseDto[];

  @ApiProperty({ description: 'Metadados da paginação' })
  meta!: any;
}
