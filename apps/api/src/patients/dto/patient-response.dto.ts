import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressDto, EmergencyContactDto } from './create-patient.dto';

export class PatientResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty({ format: 'date' })
  birthDate!: string;

  @ApiProperty()
  documentId!: string;

  @ApiProperty()
  rg!: string;

  @ApiProperty()
  gender!: string;

  @ApiProperty()
  maritalStatus!: string;

  @ApiProperty({ nullable: true })
  phone!: string | null;

  @ApiProperty({ nullable: true })
  whatsapp!: string | null;

  @ApiProperty({ nullable: true })
  email!: string | null;

  @ApiProperty()
  profession!: string;

  @ApiProperty({ type: AddressDto, nullable: true })
  addressJson!: AddressDto | null;

  @ApiPropertyOptional({ type: EmergencyContactDto })
  emergencyContact?: EmergencyContactDto | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string | Date;
}

export class PaginationMetaDto {
  @ApiProperty()
  itemCount!: number;

  @ApiProperty({ required: false })
  totalItems?: number;

  @ApiProperty()
  itemsPerPage!: number;

  @ApiProperty({ required: false })
  totalPages?: number;

  @ApiProperty()
  currentPage!: number;
}

export class PaginatedPatientsResponseDto {
  @ApiProperty({ type: [PatientResponseDto] })
  items!: PatientResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
