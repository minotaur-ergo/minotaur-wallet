import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true, name: 'address' })
  address: string;

  @Column({ type: 'integer', name: 'required_signatures' })
  requiredSignatures: number;

  @Column({ type: 'text', nullable: true, name: 'name' })
  name: string;

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

  @ManyToMany(() => User, (user) => user.wallets)
  @JoinTable({
    name: 'user_wallets',
    joinColumn: {
      name: 'wallet_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
