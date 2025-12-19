import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DrugInteractionCheckDto {
  @ApiProperty({
    description: 'Lista de IDs dos medicamentos para verificar interações',
    type: [String],
    format: 'uuid',
    example: ['123e4567-e89b-12d3-a456-426614174000', '987fcdeb-51a2-43d7-b890-123456789abc']
  })
  @IsArray()
  @IsNotEmpty()
  @IsUUID('4', { each: true })
  medicationIds!: string[];
}
