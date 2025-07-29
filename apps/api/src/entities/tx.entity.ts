import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Box } from './box.entity';
import { Hint } from './hint.entity';
import { User } from './user.entity';
import { Wallet } from './wallet.entity';

export enum TxStatus {
  COMMITMENT = 'commitment',
  SIGN = 'sign',
  SIGNED = 'signed',
  COMPLETED = 'completed',
}

@Entity('tx')
export class Tx {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'address_count' })
  addressCount: number;

  @Column({ type: 'text', name: 'serialized' })
  serialized: string;

  @Column({ type: 'text', name: 'status', default: TxStatus.COMMITMENT })
  status: TxStatus;

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

  @Column({ name: 'wallet_id' })
  walletId: number;

  @Column({ name: 'creator_id' })
  creatorId: number;

  @ManyToOne(() => Wallet, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => Box, (box) => box.tx, { eager: true })
  boxes: Box[];

  @OneToMany(() => Hint, (hint) => hint.tx, { eager: true })
  hints: Hint[];
}
