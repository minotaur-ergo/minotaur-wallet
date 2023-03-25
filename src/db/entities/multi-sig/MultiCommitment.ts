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
  inputIndex = 0;

  @Column('text', { nullable: true })
  secret? = ''; // if secret commitment store secret here
}

export default MultiCommitment;
