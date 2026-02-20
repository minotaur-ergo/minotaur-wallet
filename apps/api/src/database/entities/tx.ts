import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';
import { Wallet } from './wallet';

export enum TxStatus {
  COMMITMENT = 'commitment',
  SIGN = 'sign',
  SIGNED = 'signed',
  COMPLETED = 'completed',
}

@Entity('tx')
export class Tx {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'integer', name: 'address_count' })
  addressCount: number = 0;

  @Column({ type: 'text', name: 'serialized' })
  serialized: string = '';

  @Column({ type: 'text', name: 'status', default: TxStatus.COMMITMENT })
  status: TxStatus = TxStatus.COMMITMENT;

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

  @Column({ name: 'wallet_id' })
  walletId: number = 0;

  @Column({ name: 'creator_id' })
  creatorId: number = 0;

  @ManyToOne(() => Wallet, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet = new Wallet();

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User = new User();
}
