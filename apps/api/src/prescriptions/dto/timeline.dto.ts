import { ApiProperty } from '@nestjs/swagger';

export class PrescriptionTimelineItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty({ enum: ['draft', 'active', 'expired', 'discontinued', 'completed', 'cancelled'] })
  status!: 'draft' | 'active' | 'expired' | 'discontinued' | 'completed' | 'cancelled';

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date', required: false })
  validFrom?: string | null;

  @ApiProperty({ type: String, format: 'date', required: false })
  validUntil?: string | null;

  @ApiProperty({ description: 'Nome do prescritor', required: false })
  prescriberName?: string | null;

  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  chronicCount!: number;

  @ApiProperty()
  prnCount!: number;

  @ApiProperty()
  changedCount!: number;
}

export class PrescriptionTimelineResponseDto {
  @ApiProperty({ type: [PrescriptionTimelineItemDto] })
  items!: PrescriptionTimelineItemDto[];
}
