import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import MultiSignRow from './MultiSignRow';

@Entity({ name: 'multi-sign-input' })
class MultiSignInput {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => MultiSignRow, { onDelete: 'CASCADE' })
  tx: MultiSignRow | null = null;

  @Column('text')
  bytes = '';
}

export default MultiSignInput;
