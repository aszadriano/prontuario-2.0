import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class ReuseItemsDto {
  @IsArray()
  @ApiProperty({ type: [String], description: 'IDs dos itens a reusar (uuid[])' })
  itemIds!: string[];
}

