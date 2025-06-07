import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from '../Wallet';

@Entity({ name: 'multi-sig-row' })
class MultiSigRow {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text', { unique: true })
  txId = '';

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet | null = null;
}

export default MultiSigRow;
