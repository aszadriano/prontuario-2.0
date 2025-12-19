import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../patients/dto/patient-response.dto';
import { PatientResponseDto } from '../../patients/dto/patient-response.dto';
import { MedicationResponseDto } from '../../medications/dto/medication-response.dto';


export class PrescriptionItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  prescriptionId!: string;

  @ApiProperty({ format: 'uuid' })
  medicationId!: string;

  @ApiProperty()
  dosage!: string;

  @ApiProperty()
  frequency!: string;

  @ApiProperty()
  duration!: string;

  @ApiProperty({ nullable: true })
  instructions!: string | null;

  @ApiProperty({ nullable: true })
  quantity!: number | null;

  @ApiProperty({ type: MedicationResponseDto, required: false })
  medication?: MedicationResponseDto;
}

export class PrescriptionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;


  @ApiProperty({ enum: ['draft', 'active', 'completed', 'cancelled'] })
  status!: 'draft' | 'active' | 'completed' | 'cancelled';

  @ApiProperty({ nullable: true })
  notes!: string | null;

  @ApiProperty({ type: PatientResponseDto, required: false })
  patient?: PatientResponseDto;


  @ApiProperty({ type: [PrescriptionItemResponseDto] })
  items!: PrescriptionItemResponseDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string | Date;
}

export class PaginatedPrescriptionsResponseDto {
  @ApiProperty({ type: [PrescriptionResponseDto] })
  items!: PrescriptionResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
