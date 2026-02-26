import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tx } from './tx';

export enum HintType {
  SIMULATED = 'simulated',
  REAL = 'real',
}

@Entity('hints')
export class Hint {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'text', name: 'type' })
  type: HintType = HintType.REAL;

  @Column({ type: 'text', name: 'commit' })
  commit: string = '';

  @Column({ type: 'text', name: 'proof' })
  proof: string = '';

  @Column({ type: 'text', name: 'public_key' })
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

  @Column({ name: 'tx_id' })
  txId: number = 0;

  @ManyToOne(() => Tx, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tx_id' })
  tx: Tx = new Tx();
}
