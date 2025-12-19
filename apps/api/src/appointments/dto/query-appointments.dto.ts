import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAppointmentsDto {
  @ApiPropertyOptional({ description: 'Página atual (padrão 1)', default: 1, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 1))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ description: 'Itens por página (padrão 10)', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 10))
  @IsInt()
  @IsPositive()
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({ description: 'Filtrar por ID do paciente', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por status',
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled']
  })
  @IsOptional()
  @IsEnum(['scheduled', 'confirmed', 'completed', 'cancelled'])
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Data inicial (ISO)', example: '2024-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Data final (ISO)', example: '2024-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
