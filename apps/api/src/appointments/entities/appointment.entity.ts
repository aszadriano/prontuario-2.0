import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'uuid', name: 'doctor_id' })
  doctorId!: string;

  @Index('appointments_date_time_idx')
  @Column({ type: 'timestamptz', name: 'date_time' })
  dateTime!: Date;

  @Column({ 
    type: 'enum', 
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled'
  })
  status!: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'varchar', name: 'google_event_id', nullable: true })
  googleEventId?: string;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: User;


  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
