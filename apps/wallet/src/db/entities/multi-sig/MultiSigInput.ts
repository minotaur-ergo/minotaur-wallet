import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MultiSigRow from './MultiSigRow';

@Entity({ name: 'multi-sig-input' })
class MultiSigInput {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => MultiSigRow, { onDelete: 'CASCADE' })
  tx: MultiSigRow | null = null;

  @Column('text')
  bytes = '';
}

export default MultiSigInput;
