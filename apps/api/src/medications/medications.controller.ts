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
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { QueryMedicationsDto } from './dto/query-medications.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import {
  MedicationResponseDto,
  PaginatedMedicationsResponseDto
} from './dto/medication-response.dto';

@ApiTags('medications')
@ApiBearerAuth()
@Controller('medications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo medicamento' })
  @ApiCreatedResponse({ type: MedicationResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(createMedicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista medicamentos com paginação' })
  @ApiOkResponse({ type: PaginatedMedicationsResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  findAll(@Query() query: QueryMedicationsDto) {
    return this.medicationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes de um medicamento' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MedicationResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO, USER_ROLES.SECRETARIA)
  findOne(@Param('id') id: string) {
    return this.medicationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um medicamento' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: MedicationResponseDto })
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MEDICO)
  update(@Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
    return this.medicationsService.update(id, updateMedicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um medicamento' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Medicamento removido com sucesso' })
  @Roles(USER_ROLES.ADMIN)
  remove(@Param('id') id: string) {
    return this.medicationsService.remove(id);
  }
}
