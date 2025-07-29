import { bip32 } from '@minotaur-ergo/utils';
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
@Unique(['chainCode', 'keyData'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'chain_code' })
  chainCode: string;

  @Column({ type: 'text', name: 'key_data' })
  keyData: string;

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

  xPub = (): string => {
    try {
      const keyDataBuffer = Buffer.from(this.keyData, 'hex');
      const chainCodeBuffer = Buffer.from(this.chainCode, 'hex');

      const node = bip32.fromPublicKey(keyDataBuffer, chainCodeBuffer);
      return node.toBase58();
    } catch (error) {
      throw new Error(`Failed to generate xpub: ${error.message}`);
    }
  };
}
