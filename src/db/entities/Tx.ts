import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum TxStatus {
  Mined = 'MINED',
  MemPool = 'MEM_POOL',
  Forked = 'FORKED',
  New = 'New',
}

@Entity({ name: 'tx' })
class Tx {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text', { unique: true })
  tx_id = '';

  @Column('int')
  height = 0;

  @Column('text')
  network_type = '';

  @Column('int')
  date = 0;

  @Column('text')
  status: TxStatus = TxStatus.Mined;
}

export default Tx;

export { TxStatus };
