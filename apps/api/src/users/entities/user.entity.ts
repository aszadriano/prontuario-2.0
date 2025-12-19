import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { userRoleSchema, UserRole } from '@prontuario/shared';
import { MedicalRecord } from '../../records/entities/medical-record.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Index('users_email_uq', { unique: true })
  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'enum', enum: userRoleSchema.options })
  role!: UserRole;

  @OneToMany(() => MedicalRecord, (record) => record.doctor)
  medicalRecords!: MedicalRecord[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
