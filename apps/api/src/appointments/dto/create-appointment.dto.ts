import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID do paciente',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;


  @ApiProperty({
    description: 'Data e hora do agendamento (ISO)',
    example: '2024-12-01T14:30:00Z'
  })
  @IsDateString()
  dateTime!: string;

  @ApiPropertyOptional({
    description: 'Status do agendamento',
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled'
  })
  @IsOptional()
  @IsEnum(['scheduled', 'confirmed', 'completed', 'cancelled'])
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Observações sobre o agendamento',
    example: 'Paciente com restrições alimentares'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
