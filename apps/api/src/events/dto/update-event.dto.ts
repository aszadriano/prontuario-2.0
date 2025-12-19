import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateEventDto {
  @ApiPropertyOptional({ format: 'date-time', description: 'Novo horário de início' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ format: 'date-time', description: 'Novo horário de término' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Resumo do evento' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  summary?: string;

  @ApiPropertyOptional({ description: 'Descrição detalhada' })
  @IsOptional()
  @IsString()
  description?: string;
}
