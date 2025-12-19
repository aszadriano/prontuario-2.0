import { Module } from '@nestjs/common';
import { DrugInteractionsService } from './drug-interactions.service';
import { DrugInteractionsController } from './drug-interactions.controller';

@Module({
  controllers: [DrugInteractionsController],
  providers: [DrugInteractionsService],
  exports: [DrugInteractionsService]
})
export class DrugInteractionsModule {}
