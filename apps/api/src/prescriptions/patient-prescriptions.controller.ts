import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { USER_ROLES } from '@prontuario/shared';
import { PrescriptionsService } from './prescriptions.service';
import { QueryPatientPrescriptionsDto } from './dto/query-patient-prescriptions.dto';
import { CreateDraftDto } from './dto/create-draft.dto';
import { GenerateNextPrescriptionDto } from './dto/generate-next.dto';
import { PrescriptionTimelineResponseDto } from './dto/timeline.dto';
import { ReuseItemsDto } from './dto/reuse.dto';

@ApiTags('patient-prescriptions')
@ApiBearerAuth()
@Controller('patients/:patientId/prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientPrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get('timeline')
  @ApiOperation({ summary: 'Timeline resumida por paciente' })
  @ApiOkResponse({ type: PrescriptionTimelineResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  async timeline(@Param('patientId') patientId: string) {
    const items = await this.prescriptionsService.getTimeline(patientId);
    return { items } as PrescriptionTimelineResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Lista detalhada por paciente' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  list(@Param('patientId') patientId: string, @Query() query: QueryPatientPrescriptionsDto) {
    return this.prescriptionsService.listByPatient(patientId, query);
  }

  @Post('draft')
  @ApiOperation({ summary: 'Cria rascunho para paciente' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  createDraft(@Param('patientId') patientId: string, @Body() body: CreateDraftDto) {
    return this.prescriptionsService.createDraft({ ...body, patientId });
  }

  @Post('generate-next')
  @ApiOperation({ summary: 'Gerar próxima prescrição (sugestão)' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  generateNext(@Param('patientId') patientId: string, @Body() body: GenerateNextPrescriptionDto) {
    return this.prescriptionsService.generateNext(patientId, body);
  }

  @Post(':id/finalize')
  @ApiOperation({ summary: 'Finaliza/ativa a prescrição atual (atribui versão)' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  finalize(@Param('id') id: string) {
    return this.prescriptionsService.finalize(id);
  }

  @Get(':id/diff/:otherId')
  @ApiOperation({ summary: 'Comparação JSON entre prescrições' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  diff(@Param('id') id: string, @Param('otherId') otherId: string) {
    return this.prescriptionsService.diffPrescriptions(id, otherId);
  }

  @Post(':id/reuse')
  @ApiOperation({ summary: 'Clona itens selecionados para novo rascunho' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  reuse(@Param('patientId') patientId: string, @Param('id') id: string, @Body() body: ReuseItemsDto) {
    return this.prescriptionsService.reuseFrom(id, body.itemIds, patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe completo da prescrição' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  getOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }
}
