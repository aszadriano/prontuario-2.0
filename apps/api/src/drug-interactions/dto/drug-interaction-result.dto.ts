import { ApiProperty } from '@nestjs/swagger';

export class DrugInteractionDto {
  @ApiProperty({
    description: 'Severidade da interação',
    enum: ['minor', 'moderate', 'major'],
    example: 'moderate'
  })
  severity!: 'minor' | 'moderate' | 'major';

  @ApiProperty({
    description: 'Descrição da interação',
    example: 'Aumento do risco de sangramento quando usado concomitantemente'
  })
  description!: string;

  @ApiProperty({
    description: 'Nomes dos medicamentos que interagem',
    type: [String],
    example: ['Aspirina', 'Warfarina']
  })
  medications!: string[];
}

export class DrugInteractionResultDto {
  @ApiProperty({
    description: 'Lista de interações encontradas',
    type: [DrugInteractionDto]
  })
  interactions!: DrugInteractionDto[];
}
