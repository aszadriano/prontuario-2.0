import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrescriptionItemDto {
  @ApiProperty({
    description: 'ID do medicamento',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  medicationId!: string;

  @ApiProperty({
    description: 'Dosagem do medicamento',
    maxLength: 100,
    example: '500mg'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dosage!: string;

  @ApiProperty({
    description: 'Frequência de uso',
    maxLength: 100,
    example: '3x/dia'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  frequency!: string;

  @ApiProperty({
    description: 'Duração do tratamento',
    maxLength: 100,
    example: '7 dias'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  duration!: string;

  @ApiPropertyOptional({
    description: 'Instruções específicas',
    example: 'Tomar com água após as refeições'
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Quantidade prescrita',
    example: 21,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;
}
