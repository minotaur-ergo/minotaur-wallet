import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tx } from './tx.entity';

export enum BoxType {
  INPUT = 'input',
  DATA_INPUT = 'data_input',
}

@Entity('boxes')
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'serialized' })
  serialized: string;

  @Column({ type: 'text', name: 'type' })
  type: BoxType;

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

  @Column({ name: 'tx_id' })
  txId: number;

  @ManyToOne(() => Tx, (tx) => tx.boxes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tx_id' })
  tx: Tx;
}
