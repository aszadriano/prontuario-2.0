import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class GenerateNextPrescriptionDto {
  @IsUUID()
  @ApiPropertyOptional({ description: 'Paciente alvo (uuid)', required: false })
  patientId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: true })
  carryChronics?: boolean = true;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: true })
  skipTimeLimited?: boolean = true;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: false })
  copyNotes?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: true })
  adjustEndDates?: boolean = true;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: true })
  excludeDuplicates?: boolean = true;
}

export type GenerateNextWarning = string;

export interface GeneratedDraftResponse {
  draftId: string;
  warnings: GenerateNextWarning[];
}

