import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MultiSigRow from './MultiSigRow';

enum MultiSigTxType {
  Reduced = 'REDUCED',
  Partial = 'PARTIAL',
}

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

  @Column('text')
  type: MultiSigTxType = MultiSigTxType.Reduced;
}

export default MultiSigTx;
export { MultiSigTxType };
