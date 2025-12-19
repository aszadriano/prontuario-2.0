import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { QueryMedicationsDto } from './dto/query-medications.dto';
import { MedicationResponseDto, PaginatedMedicationsResponseDto } from './dto/medication-response.dto';
import { PaginationMetaDto } from '../patients/dto/patient-response.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<MedicationResponseDto> {
    const medication = this.medicationRepository.create(createMedicationDto);
    const savedMedication = await this.medicationRepository.save(medication);
    return this.toResponseDto(savedMedication);
  }

  async findAll(query: QueryMedicationsDto): Promise<PaginatedMedicationsResponseDto> {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.medicationRepository.createQueryBuilder('medication');

    if (search) {
      queryBuilder.where(
        '(medication.name ILIKE :search OR medication.genericName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [medications, total] = await queryBuilder
      .orderBy('medication.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const meta: PaginationMetaDto = {
      itemCount: medications.length,
      totalItems: total,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };

    return {
      items: medications.map(med => this.toResponseDto(med)),
      meta
    };
  }

  async findOne(id: string): Promise<MedicationResponseDto> {
    const medication = await this.medicationRepository.findOne({
      where: { id }
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return this.toResponseDto(medication);
  }

  async update(id: string, updateMedicationDto: UpdateMedicationDto): Promise<MedicationResponseDto> {
    const medication = await this.medicationRepository.findOne({
      where: { id }
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    Object.assign(medication, updateMedicationDto);
    const savedMedication = await this.medicationRepository.save(medication);
    return this.toResponseDto(savedMedication);
  }

  async remove(id: string): Promise<void> {
    const result = await this.medicationRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
  }

  private toResponseDto(medication: Medication): MedicationResponseDto {
    return {
      id: medication.id,
      name: medication.name,
      genericName: medication.genericName,
      concentration: medication.concentration,
      form: medication.form,
      manufacturer: medication.manufacturer,
      createdAt: medication.createdAt,
      updatedAt: medication.updatedAt
    };
  }
}
