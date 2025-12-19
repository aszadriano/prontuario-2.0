import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Nome do medicamento',
    maxLength: 180,
    example: 'Paracetamol'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  name!: string;

  @ApiProperty({
    description: 'Nome genérico do medicamento',
    maxLength: 180,
    example: 'acetaminofen'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  genericName!: string;

  @ApiProperty({
    description: 'Concentração do medicamento',
    maxLength: 100,
    example: '500mg'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  concentration!: string;

  @ApiPropertyOptional({
    description: 'Forma do medicamento',
    maxLength: 100,
    example: 'tablet',
    default: 'tablet'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  form?: string;


  @ApiPropertyOptional({
    description: 'Fabricante do medicamento',
    maxLength: 180,
    example: 'EMS'
  })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  manufacturer?: string;
}
