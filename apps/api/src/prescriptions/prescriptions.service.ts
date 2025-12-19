import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { QueryPrescriptionsDto } from './dto/query-prescriptions.dto';
import { PrescriptionResponseDto, PaginatedPrescriptionsResponseDto } from './dto/prescription-response.dto';
import { PaginationMetaDto } from '../patients/dto/patient-response.dto';
import { QueryPatientPrescriptionsDto } from './dto/query-patient-prescriptions.dto';
import { CreateDraftDto } from './dto/create-draft.dto';
import { GenerateNextPrescriptionDto, GeneratedDraftResponse } from './dto/generate-next.dto';
import { PrescriptionTimelineItemDto } from './dto/timeline.dto';
import { Medication } from '../medications/entities/medication.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private readonly prescriptionItemRepository: Repository<PrescriptionItem>,
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    const prescription = this.prescriptionRepository.create({
      patientId: createPrescriptionDto.patientId,
      notes: createPrescriptionDto.notes,
      status: (createPrescriptionDto.status ?? 'draft') as any
    });

    const savedPrescription = await this.prescriptionRepository.save(prescription);

    // Create prescription items
    const items = createPrescriptionDto.items.map((itemDto) =>
      this.prescriptionItemRepository.create({
        prescriptionId: savedPrescription.id,
        medicationId: itemDto.medicationId,
        dosage: itemDto.dosage,
        frequency: itemDto.frequency,
        duration: itemDto.duration,
        instructions: itemDto.instructions,
        quantity: itemDto.quantity
      })
    );

    const savedItems = await this.prescriptionItemRepository.save(items);
    savedPrescription.items = savedItems;

    return this.toResponseDto(savedPrescription);
  }

  async findAll(query: QueryPrescriptionsDto): Promise<PaginatedPrescriptionsResponseDto> {
    const { page, limit, patientId, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.prescriptionRepository.createQueryBuilder('prescription')
      .leftJoinAndSelect('prescription.patient', 'patient')
      .leftJoinAndSelect('prescription.items', 'items')
      .leftJoinAndSelect('items.medication', 'medication');

    if (patientId) {
      queryBuilder.andWhere('prescription.patientId = :patientId', { patientId });
    }

    if (status) {
      queryBuilder.andWhere('prescription.status = :status', { status });
    }

    const [prescriptions, total] = await queryBuilder
      .orderBy('prescription.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const meta: PaginationMetaDto = {
      itemCount: prescriptions.length,
      totalItems: total,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };

    return {
      items: prescriptions.map(prescription => this.toResponseDto(prescription)),
      meta
    };
  }

  async findOne(id: string): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['patient', 'items', 'items.medication']
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    return this.toResponseDto(prescription);
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['patient', 'items', 'items.medication']
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }

    // Update prescription data
    Object.assign(prescription, updatePrescriptionDto);
    const savedPrescription = await this.prescriptionRepository.save(prescription);

    // Update items if provided
    if (updatePrescriptionDto.items) {
      // Remove existing items
      await this.prescriptionItemRepository.delete({ prescriptionId: id });

      // Create new items
      const items: PrescriptionItem[] = [];
      for (const itemDto of updatePrescriptionDto.items as any[]) {
        items.push(this.prescriptionItemRepository.create({
          prescriptionId: id,
          medicationId: itemDto.medicationId,
          dosage: itemDto.dosage,
          frequency: itemDto.frequency,
          duration: itemDto.duration,
          instructions: itemDto.instructions,
          quantity: itemDto.quantity
        }));
      }

      const savedItems = await this.prescriptionItemRepository.save(items);
      savedPrescription.items = savedItems;
    }

    return this.toResponseDto(savedPrescription);
  }

  async remove(id: string): Promise<void> {
    const result = await this.prescriptionRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Prescription with ID ${id} not found`);
    }
  }

  private toResponseDto(prescription: Prescription): PrescriptionResponseDto {
    return {
      id: prescription.id,
      patientId: prescription.patientId,
      status: prescription.status,
      notes: prescription.notes,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // @ts-ignore legacy fields handled
      patient: prescription.patient ? {
        id: prescription.patient.id,
        fullName: prescription.patient.fullName,
        birthDate: prescription.patient.birthDate,
        documentId: prescription.patient.documentId,
        phone: prescription.patient.phone,
        email: prescription.patient.email,
        addressJson: prescription.patient.addressJson,
        createdAt: prescription.patient.createdAt,
        updatedAt: prescription.patient.updatedAt
      } : undefined,
      items: prescription.items?.map(item => ({
        id: item.id,
        prescriptionId: item.prescriptionId,
        medicationId: item.medicationId as string,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions ?? null,
        quantity: item.quantity ?? null,
        medication: item.medication ? {
          id: item.medication.id,
          name: item.medication.name,
          genericName: item.medication.genericName,
          concentration: item.medication.concentration,
          form: item.medication.form,
          manufacturer: item.medication.manufacturer,
          createdAt: item.medication.createdAt,
          updatedAt: item.medication.updatedAt
        } : undefined
      })) || [],
      createdAt: prescription.createdAt,
      updatedAt: prescription.updatedAt
    };
  }

  // New API: patient-scoped listing with filters
  async listByPatient(patientId: string, filters: QueryPatientPrescriptionsDto): Promise<PaginatedPrescriptionsResponseDto> {
    const { page = 1, limit = 20, q, status, from, to } = filters;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Prescription> = { patientId };
    if (status) where.status = status as any;

    const qb = this.prescriptionRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.items', 'items')
      .leftJoinAndSelect('p.patient', 'patient')
      .where('p.patientId = :patientId', { patientId });

    if (status) {
      qb.andWhere('p.status = :status', { status });
    }

    if (q) {
      qb.leftJoin('items.medication', 'med')
        .andWhere('(med.name ILIKE :q OR med.genericName ILIKE :q)', { q: `%${q}%` });
    }

    const [rows, total] = await qb
      .orderBy('p.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const meta: PaginationMetaDto = {
      itemCount: rows.length,
      totalItems: total,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };

    return { items: rows.map((r) => this.toResponseDto(r)), meta };
  }

  async getTimeline(patientId: string): Promise<PrescriptionTimelineItemDto[]> {
    const rows = await this.prescriptionRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
      relations: ['items']
    });
    // derive versions by order (latest gets highest)
    const total = rows.length;
    return rows.map((p, idx) => ({
      id: p.id,
      version: total - idx,
      status: p.status as any,
      createdAt: p.createdAt,
      validFrom: undefined,
      validUntil: undefined,
      prescriberName: null,
      totalItems: p.items?.length ?? 0,
      chronicCount: 0,
      prnCount: 0,
      changedCount: 0
    }));
  }

  async createDraft(payload: CreateDraftDto): Promise<PrescriptionResponseDto> {
    // Map CreateDraftDto to legacy structure using medicationId lookups by name
    const presc = await this.prescriptionRepository.save(this.prescriptionRepository.create({
      patientId: payload.patientId,
      status: 'draft',
      notes: payload.notes
    }));
    const items: PrescriptionItem[] = [];
    for (const i of payload.items || []) {
      // Prefer medicationId; fallback to lookup by name
      let medId: string | null = i.medicationId ?? null;
      if (!medId && i.medicationName) {
        const med = await this.medicationRepository.findOne({ where: { name: i.medicationName } });
        if (med) medId = med.id;
      }
      if (!medId) continue;
      items.push(this.prescriptionItemRepository.create({
        prescriptionId: presc.id,
        medicationId: medId,
        dosage: i.dosage,
        frequency: i.frequency,
        duration: (i.durationDays ? `${i.durationDays} dias` : 'uso conforme orientação'),
        instructions: i.notes ?? undefined
      }));
    }
    const savedItems = await this.prescriptionItemRepository.save(items);
    presc.items = savedItems;
    return this.toResponseDto(presc);
  }

  async finalize(prescriptionId: string): Promise<PrescriptionResponseDto> {
    const presc = await this.prescriptionRepository.findOne({ where: { id: prescriptionId }, relations: ['items'] });
    if (!presc) throw new NotFoundException('Prescription not found');

    // Basic validations: duplicate medication entries
    const dupNames = new Set<string>();
    const seen = new Set<string>();
    for (const it of presc.items ?? []) {
      const key = String(it.medicationId);
      if (seen.has(key)) dupNames.add(key);
      seen.add(key);
    }
    if (dupNames.size > 0) {
      throw new BadRequestException(`Itens duplicados: ${Array.from(dupNames).join(', ')}`);
    }

    // Legacy finalize: simply set active if draft
    if (presc.status === 'draft') {
      presc.status = 'active' as any;
    }

    const saved = await this.prescriptionRepository.save(presc);
    return this.toResponseDto(saved);
  }

  async generateNext(patientId: string, options: GenerateNextPrescriptionDto): Promise<GeneratedDraftResponse & { draft: PrescriptionResponseDto; clinicalWarnings: string[] } > {
    // Get latest active or most recent
    const latest = await this.prescriptionRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
      relations: ['items']
    });
    const base = latest[0];

    const warnings: string[] = [];
    const today = new Date().toISOString().slice(0, 10);

    const carryChronics = options.carryChronics !== false;
    const skipTimeLimited = options.skipTimeLimited !== false;
    const excludeDuplicates = options.excludeDuplicates !== false;

    type SuggestedItem = { medicationId: string; medicationName?: string; dosage: string; frequency: string };
    const items: SuggestedItem[] = [];
    if (base?.items) {
      const seen = new Set<string>();
      for (const it of base.items) {
        const id = String(it.medicationId);
        if (excludeDuplicates && seen.has(id)) continue;
        seen.add(id);
        items.push({
          medicationId: id,
          medicationName: it.medication?.name,
          dosage: it.dosage,
          frequency: it.frequency
        });
      }
    }

    const draftDto: CreateDraftDto = {
      patientId,
      status: 'draft',
      validFrom: undefined,
      validUntil: undefined as any,
      notes: options.copyNotes && base?.notes ? base.notes : undefined,
      items: items.map((i: SuggestedItem) => ({
        medicationId: i.medicationId,
        medicationName: i.medicationName,
        dosage: i.dosage!,
        frequency: i.frequency!,
        route: undefined,
        durationDays: undefined,
        isChronic: false,
        isPrn: false
      }))
    };

    const draft = await this.createDraft(draftDto);
    return { draftId: draft.id, warnings, draft, clinicalWarnings: [] };
  }

  async diffPrescriptions(aId: string, bId: string): Promise<{ added: PrescriptionItem[]; removed: PrescriptionItem[]; changed: Array<{ before: PrescriptionItem; after: PrescriptionItem }>; }> {
    const [a, b] = await Promise.all([
      this.prescriptionRepository.findOne({ where: { id: aId }, relations: ['items'] }),
      this.prescriptionRepository.findOne({ where: { id: bId }, relations: ['items'] })
    ]);
    if (!a || !b) throw new NotFoundException('Prescrição não encontrada para diff');
    const mapA = new Map(a.items.map((i) => [(i.medication?.name || i.medicationId).toString().toLowerCase(), i]));
    const mapB = new Map(b.items.map((i) => [(i.medication?.name || i.medicationId).toString().toLowerCase(), i]));

    const added: PrescriptionItem[] = [];
    const removed: PrescriptionItem[] = [];
    const changed: Array<{ before: PrescriptionItem; after: PrescriptionItem }> = [];

    for (const [name, itB] of mapB.entries()) {
      if (!mapA.has(name)) {
        added.push(itB);
      } else {
        const itA = mapA.get(name)!;
        if (itA.dosage !== itB.dosage || itA.frequency !== itB.frequency || itA.duration !== itB.duration) {
          changed.push({ before: itA, after: itB });
        }
      }
    }
    for (const [name, itA] of mapA.entries()) {
      if (!mapB.has(name)) removed.push(itA);
    }
    return { added, removed, changed };
  }

  async reuseFrom(prescriptionId: string, itemIds: string[], patientId: string): Promise<PrescriptionResponseDto> {
    const presc = await this.prescriptionRepository.findOne({ where: { id: prescriptionId }, relations: ['items'] });
    if (!presc) throw new NotFoundException('Prescrição base não encontrada');
    const selected = presc.items.filter((i) => itemIds.includes(i.id));
    if (selected.length === 0) throw new BadRequestException('Nenhum item selecionado');
    const draft = await this.createDraft({
      patientId,
      status: 'draft',
      items: selected.map((i) => ({
        medicationName: i.medication?.name || String(i.medicationId),
        dosage: i.dosage,
        frequency: i.frequency
      }))
    } as CreateDraftDto);
    return draft;
  }
}
