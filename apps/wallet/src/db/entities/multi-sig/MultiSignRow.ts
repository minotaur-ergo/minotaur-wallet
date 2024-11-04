import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from '../Wallet';

@Entity({ name: 'multi-sign-row' })
class MultiSignRow {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text', { unique: true })
  txId = '';

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet | null = null;

  @Column('text', {nullable: true})
  serverId = ''
}

export default MultiSignRow;
