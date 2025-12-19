import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { USER_ROLES } from '@prontuario/shared';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { MedicalRecordResponseDto } from './dto/medical-record-response.dto';

@ApiTags('records')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('patients/:patientId/records')
  @ApiOperation({ summary: 'Cria um prontuário para o paciente' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: MedicalRecordResponseDto })
  @Roles(USER_ROLES.MEDICO)
  create(
    @Param('patientId') patientId: string,
    @CurrentUser() user: User,
    @Body() createRecordDto: CreateRecordDto
  ) {
    return this.recordsService.create(patientId, user, createRecordDto);
  }

  @Get('patients/:patientId/records')
  @ApiOperation({ summary: 'Lista os prontuários de um paciente' })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: [MedicalRecordResponseDto] })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  findAllForPatient(@Param('patientId') patientId: string) {
    return this.recordsService.findAllForPatient(patientId);
  }

  @Get('records/:id')
  @ApiOperation({ summary: 'Obtém um prontuário pelo ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MedicalRecordResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Put('records/:id')
  @ApiOperation({ summary: 'Atualiza um prontuário existente' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MedicalRecordResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateRecordDto: UpdateRecordDto
  ) {
    return this.recordsService.update(id, user, updateRecordDto);
  }

  @Delete('records/:id')
  @ApiOperation({ summary: 'Remove um prontuário' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Prontuário removido com sucesso' })
  @Roles(USER_ROLES.ADMIN)
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
