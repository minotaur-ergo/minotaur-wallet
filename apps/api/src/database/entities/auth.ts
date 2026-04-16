import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';

@Entity('user_auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'text', unique: true, name: 'public_key' })
  publicKey: string = '';

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date = new Date();

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date = new Date();

  @Column({ name: 'user_id' })
  userId: number = 0;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User = new User();
}
