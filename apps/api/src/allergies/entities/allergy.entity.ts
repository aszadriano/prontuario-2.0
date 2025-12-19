import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Entity({ name: 'allergies' })
export class Allergy {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('allergies_patient_id_idx')
  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'varchar', length: 180 })
  substance!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  reaction?: string | null;

  @Column({ type: 'enum', enum: ['leve', 'moderada', 'grave'], default: 'leve' })
  severity!: 'leve' | 'moderada' | 'grave';

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}

