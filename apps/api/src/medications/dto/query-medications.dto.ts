import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryMedicationsDto {
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

  @ApiPropertyOptional({ description: 'Busca por nome ou nome genérico do medicamento' })
  @IsOptional()
  @IsString()
  search?: string;
}
