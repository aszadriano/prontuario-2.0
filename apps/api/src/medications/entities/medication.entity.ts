import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'medications' })
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('medications_name_idx')
  @Column({ type: 'varchar', length: 180 })
  name!: string;

  @Index('medications_generic_name_idx')
  @Column({ type: 'varchar', length: 180 })
  genericName!: string;

  @Column({ type: 'varchar', length: 100 })
  concentration!: string;

  @Column({ type: 'varchar', default: 'tablet' })
  form!: string;


  @Column({ type: 'varchar', length: 180, nullable: true })
  manufacturer?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
