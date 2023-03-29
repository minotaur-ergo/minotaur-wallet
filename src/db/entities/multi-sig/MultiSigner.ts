import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from '../Wallet';
import MultiSignRow from './MultiSignRow';

enum MultiSigSignerType {
  Signed = 'SIGNED',
  Simulated = 'SIMULATED',
}

@Entity({ name: 'multi-signer' })
class MultiSigner {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  tx: MultiSignRow | null = null;

  @Column('text')
  signer = '';

  @Column('text')
  type: MultiSigSignerType = MultiSigSignerType.Signed;
}

export default MultiSigner;
export { MultiSigSignerType };
