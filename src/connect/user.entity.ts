import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'wxId', nullable: true })
  wxId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'phoneCode', nullable: true })
  phoneCode: string;

  @Column({ name: 'createTime' })
  createTime: Date;

  @Column({ name: 'activeTime', nullable: true })
  activeTime: Date;

  @Column()
  status: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  pwd: string;
}
