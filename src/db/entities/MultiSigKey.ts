import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from './Wallet';

@Entity({ name: 'multi_sig_key' })
class MultiSigKey {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet | null = null;

  @Column('text')
  extended_key = '';

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  sign_wallet: Wallet | null = null;
}

export default MultiSigKey;
