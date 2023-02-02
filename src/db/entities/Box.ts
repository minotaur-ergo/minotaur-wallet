import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Address from './Address';
import Tx from './Tx';
import BigIntValueTransformer from './Transformer';
import { Unique } from 'typeorm/browser';

@Entity({ name: 'box' })
@Unique('box_id_in_network', ['network_type', 'box_id'])
class Box {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Address)
  address: Address | null = null;

  @ManyToOne(() => Tx)
  tx: Tx | null = null;

  @ManyToOne(() => Tx, { nullable: true })
  spend_tx: Tx | null = null;

  @Column('text')
  box_id = '';

  @Column('text')
  network_type = '';

  @Column('text', { transformer: new BigIntValueTransformer() })
  erg = BigInt(0);

  @Column('int')
  create_index = 0;

  @Column('int')
  create_height = 0;

  @Column('int', { nullable: true })
  spend_index = 0;

  @Column('int', { nullable: true })
  spend_height = 0;

  @Column('int', { default: 0 })
  asset_count = 0;

  @Column('text')
  json = '';
}

export default Box;
