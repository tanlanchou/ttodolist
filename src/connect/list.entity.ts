import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('list')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'date', nullable: true })
  curDay: Date;

  @Column({ type: 'datetime', nullable: true })
  taskTime: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  flag: number;

  @Column({ nullable: true })
  status: number;
}
