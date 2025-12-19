import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationResponseDto } from './dto/consultation-response.dto';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova consulta' })
  @ApiResponse({ status: 201, description: 'Consulta criada com sucesso', type: ConsultationResponseDto })
  async create(@Body() createConsultationDto: CreateConsultationDto): Promise<ConsultationResponseDto> {
    return this.consultationsService.create(createConsultationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as consultas' })
  @ApiResponse({ status: 200, description: 'Lista de consultas', type: [ConsultationResponseDto] })
  async findAll(): Promise<ConsultationResponseDto[]> {
    return this.consultationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar consulta por ID' })
  @ApiResponse({ status: 200, description: 'Consulta encontrada', type: ConsultationResponseDto })
  async findOne(@Param('id') id: string): Promise<ConsultationResponseDto> {
    return this.consultationsService.findOne(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Buscar consultas por paciente' })
  @ApiResponse({ status: 200, description: 'Lista de consultas do paciente', type: [ConsultationResponseDto] })
  async findByPatient(@Param('patientId') patientId: string): Promise<ConsultationResponseDto[]> {
    return this.consultationsService.findByPatient(patientId);
  }
}
