import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../patients/dto/patient-response.dto';

export class MedicationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  genericName!: string;

  @ApiProperty()
  concentration!: string;

  @ApiProperty()
  form!: string;


  @ApiProperty({ nullable: true })
  manufacturer!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string | Date;
}

export class PaginatedMedicationsResponseDto {
  @ApiProperty({ type: [MedicationResponseDto] })
  items!: MedicationResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
