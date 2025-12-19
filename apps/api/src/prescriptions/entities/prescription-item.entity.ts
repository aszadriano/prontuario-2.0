import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Medication } from '../../medications/entities/medication.entity';
import { Prescription } from './prescription.entity';

@Entity({ name: 'prescription_items' })
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  prescriptionId!: string;

  @Column({ type: 'uuid' })
  medicationId!: string;

  @Column({ type: 'varchar', length: 100 })
  dosage!: string;

  @Column({ type: 'varchar', length: 100 })
  frequency!: string;

  @Column({ type: 'varchar', length: 100 })
  duration!: string;

  @Column({ type: 'text', nullable: true })
  instructions?: string | null;

  @Column({ type: 'int', nullable: true })
  quantity?: number | null;

  @ManyToOne(() => Prescription, (prescription) => prescription.items, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'prescription_id' })
  prescription?: Prescription;

  @ManyToOne(() => Medication, { eager: true })
  @JoinColumn({ name: 'medication_id' })
  medication?: Medication;
}
