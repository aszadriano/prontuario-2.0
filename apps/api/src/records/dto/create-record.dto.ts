import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({ description: 'Resumo do atendimento', example: 'Consulta de rotina' })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiPropertyOptional({ description: 'Notas detalhadas em formato livre', type: 'object' })
  @IsOptional()
  @IsObject()
  notes?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Lista de tags associadas ao prontuário', type: [String], example: ['inicial', 'retorno'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
