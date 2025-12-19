import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { USER_ROLES } from '@prontuario/shared';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { QueryPrescriptionsDto } from './dto/query-prescriptions.dto';
import { QueryPatientPrescriptionsDto } from './dto/query-patient-prescriptions.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import {
  PrescriptionResponseDto,
  PaginatedPrescriptionsResponseDto
} from './dto/prescription-response.dto';

@ApiTags('prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova prescrição' })
  @ApiCreatedResponse({ type: PrescriptionResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista prescrições com paginação' })
  @ApiOkResponse({ type: PaginatedPrescriptionsResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  findAll(@Query() query: QueryPrescriptionsDto) {
    return this.prescriptionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes de uma prescrição' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: PrescriptionResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma prescrição' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: PrescriptionResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  update(@Param('id') id: string, @Body() updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma prescrição' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Prescrição removida com sucesso' })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Lista prescrições por paciente' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: PaginatedPrescriptionsResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  listByPatient(
    @Param('patientId') patientId: string,
    @Query() query: QueryPatientPrescriptionsDto
  ) {
    return this.prescriptionsService.listByPatient(patientId, query);
  }

  @Get('patient/:patientId/timeline')
  @ApiOperation({ summary: 'Timeline simples de prescrições (versões)' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: [Object] })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  timeline(@Param('patientId') patientId: string) {
    return this.prescriptionsService.getTimeline(patientId);
  }
}
