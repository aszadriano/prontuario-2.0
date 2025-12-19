import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { USER_ROLES } from '@prontuario/shared';
import { DrugInteractionsService } from './drug-interactions.service';
import { DrugInteractionCheckDto } from './dto/drug-interaction-check.dto';
import { DrugInteractionResultDto } from './dto/drug-interaction-result.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('drug-interactions')
@ApiBearerAuth()
@Controller('drug-interactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DrugInteractionsController {
  constructor(private readonly drugInteractionsService: DrugInteractionsService) {}

  @Post()
  @ApiOperation({ summary: 'Verifica interações medicamentosas' })
  @ApiOkResponse({ type: DrugInteractionResultDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  checkInteractions(@Body() checkDto: DrugInteractionCheckDto) {
    return this.drugInteractionsService.checkInteractions(checkDto);
  }
}
