import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Auth } from './auth.entity';
import { Wallet } from './wallet.entity';

@Entity('users')
@Unique(['chainCode', 'masterPub'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'chain_code' })
  chainCode: string;

  @Column({ type: 'text', name: 'master_pub' })
  masterPub: string;

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

  @OneToMany(() => Auth, (auth) => auth.user, { eager: true })
  publicKeys: Auth[];

  @ManyToMany(() => Wallet, (wallet) => wallet.users, { eager: true })
  wallets: Wallet[];
}
