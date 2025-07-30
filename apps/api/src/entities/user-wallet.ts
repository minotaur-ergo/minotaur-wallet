import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.js';
import { Wallet } from './wallet.js';

@Entity('user_wallets')
export class UserWallet {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ name: 'user_id' })
  userId: number = 0;

  @Column({ name: 'wallet_id' })
  walletId: number = 0;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User = new User();

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet = new Wallet();
}
