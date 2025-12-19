import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from '../../auth/dto/auth-response.dto';
import { PatientResponseDto } from '../../patients/dto/patient-response.dto';

export class MedicalRecordResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ type: () => PatientResponseDto })
  patient!: PatientResponseDto;

  @ApiProperty({ type: () => AuthUserDto })
  doctor!: AuthUserDto;

  @ApiProperty()
  summary!: string;

  @ApiProperty({ type: Object, nullable: true })
  notes!: Record<string, unknown> | null;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string | Date;
}
