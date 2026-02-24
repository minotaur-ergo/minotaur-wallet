import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Tx } from './tx';

export enum BoxType {
  INPUT = 'input',
  DATA_INPUT = 'data_input',
}

@Entity('boxes')
export class Box {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'text', name: 'serialized' })
  serialized: string = '';

  @Column({ type: 'text', name: 'type' })
  type: BoxType = BoxType.INPUT;

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
