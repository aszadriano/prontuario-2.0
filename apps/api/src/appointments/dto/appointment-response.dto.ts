import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto , PatientResponseDto } from '../../patients/dto/patient-response.dto';



export class AppointmentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  patientId!: string;

  @ApiProperty({ format: 'uuid' })
  doctorId!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  dateTime!: string | Date;

  @ApiProperty({ enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] })
  status!: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

  @ApiProperty({ nullable: true })
  notes!: string | null;

  @ApiProperty({ nullable: true })
  googleEventId?: string;

  @ApiProperty({ type: PatientResponseDto, required: false })
  patient?: PatientResponseDto;


  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string | Date;
}

export class PaginatedAppointmentsResponseDto {
  @ApiProperty({ type: [AppointmentResponseDto] })
  items!: AppointmentResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
