import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MultiSignRow from './MultiSignRow';

enum MultiSigHintType {
  Real = 'REAL',
  Simulated = 'SIMULATED',
}

@Entity({ name: 'multi-sig-hint' })
class MultiSigHint {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => MultiSignRow, { onDelete: 'CASCADE' })
  tx: MultiSignRow | null = null;

  @Column('text')
  type: MultiSigHintType = MultiSigHintType.Real;

  @Column('text')
  commit = '';

  @Column('text', { nullable: true })
  proof? = ''; // This field can be empty

  @Column('int')
  index = 0; // Index within the input

  @Column('int')
  inputIndex = 0; // Index of the input

  @Column('text', { nullable: true })
  secret? = ''; // Secret can be empty
}

export default MultiSigHint;
export { MultiSigHintType };
