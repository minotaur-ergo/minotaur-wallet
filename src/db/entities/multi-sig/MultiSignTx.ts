import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from '../Wallet';
import MultiSignRow from './MultiSignRow';

@Entity({ name: 'multi-sign-tx' })
class MultiSigSignInput {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  tx: MultiSignRow | null = null;

  @Column('text')
  bytes = '';

  @Column('int')
  index = 0;
}

export default MultiSigSignInput;
