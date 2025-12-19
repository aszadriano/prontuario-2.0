import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { MedicalRecord } from '../../records/entities/medical-record.entity';
import type { AddressDto, EmergencyContactDto } from '../dto/create-patient.dto';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('patients_full_name_idx')
  @Column({ type: 'varchar', length: 180 })
  fullName!: string;

  @Column({ type: 'date' })
  birthDate!: string;

  @Index('patients_document_id_idx')
  @Column({ type: 'varchar', length: 40, unique: true })
  documentId!: string;

  @Column({ type: 'varchar', length: 40, default: '' })
  rg!: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  gender!: string;

  @Column({ type: 'varchar', length: 30, default: '' })
  maritalStatus!: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  whatsapp?: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 120, default: '' })
  profession!: string;

  @Column({ type: 'jsonb', nullable: true })
  addressJson?: AddressDto | null;

  @Column({ type: 'jsonb', nullable: true })
  emergencyContact?: EmergencyContactDto | null;

  @OneToMany(() => MedicalRecord, (record) => record.patient)
  medicalRecords!: MedicalRecord[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
