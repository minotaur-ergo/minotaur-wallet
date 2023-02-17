import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from '../Wallet';
import MultiSignRow from './MultiSignRow';

@Entity({ name: 'multi-commitment' })
class MultiCommitment {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  tx: MultiSignRow | null = null;

  @Column('text')
  bytes = '';

  @Column('int')
  index = 0;

  @Column('int')
  secret = 0; // use 0 for public and 1 for secret
}

export default MultiCommitment;
