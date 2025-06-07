import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MultiSigRow from './MultiSigRow';

@Entity({ name: 'multi-sig-tx' })
class MultiSigTx {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => MultiSigRow, { onDelete: 'CASCADE' })
  tx: MultiSigRow | null = null;

  @Column('text')
  bytes = '';

  @Column('int')
  idx = 0;
}

export default MultiSigTx;
