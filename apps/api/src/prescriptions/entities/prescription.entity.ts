import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { PrescriptionItem } from './prescription-item.entity';

@Entity({ name: 'prescriptions' })
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('prescriptions_patient_id_idx')
  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  })
  status!: 'draft' | 'active' | 'completed' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  // Derived version/validity will be computed in service; no columns here

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  // prescriber relation omitted for backward compatibility

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, {
    cascade: true,
    eager: true
  })
  items!: PrescriptionItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
