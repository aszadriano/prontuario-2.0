import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsNumber, IsObject, IsOptional } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ description: 'ID do paciente' })
  @IsUUID()
  patientId!: string;

  @ApiPropertyOptional({ description: 'ID do agendamento relacionado' })
  @IsUUID()
  @IsOptional()
  appointmentId?: string;

  @ApiProperty({ description: 'ID do médico responsável pela consulta' })
  @IsUUID()
  doctorId!: string;

  @ApiProperty({ description: 'ID do schema usado' })
  @IsString()
  schemaId!: string;

  @ApiProperty({ description: 'Data e hora de início da consulta' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ description: 'Data e hora de fim da consulta' })
  @IsDateString()
  endTime!: string;

  @ApiProperty({ description: 'Duração da consulta em minutos' })
  @IsNumber()
  durationMinutes!: number;

  @ApiProperty({ description: 'Anotações da consulta em formato JSON' })
  @IsObject()
  notes!: any;

  @ApiPropertyOptional({ description: 'Resumo da consulta' })
  @IsString()
  @IsOptional()
  summary?: string;
}
