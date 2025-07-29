import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('user_auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true, name: 'public_key' })
  publicKey: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.publicKeys, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
