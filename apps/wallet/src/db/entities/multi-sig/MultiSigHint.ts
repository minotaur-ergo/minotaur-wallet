import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MultiSigRow from './MultiSigRow';

enum MultiSigHintType {
  Real = 'REAL',
  Simulated = 'SIMULATED',
}

@Entity({ name: 'multi-sig-hint' })
class MultiSigHint {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => MultiSigRow, { onDelete: 'CASCADE' })
  tx: MultiSigRow | null = null;

  @Column('text')
  type: MultiSigHintType = MultiSigHintType.Real;

  @Column('text')
  commit = '';

  @Column('text', { nullable: true })
  proof? = ''; // This field can be empty

  @Column('int')
  idx = 0; // Index within the input

  @Column('int')
  inpIdx = 0; // Index of the input

  @Column('text', { nullable: true })
  secret? = ''; // Secret can be empty
}

export default MultiSigHint;
export { MultiSigHintType };
