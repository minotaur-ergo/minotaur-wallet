import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Address from './Address';
import Tx from './Tx';
import BigIntValueTransformer from './Transformer';
import { Unique } from 'typeorm/browser';

@Entity({ name: 'box' })
@Unique('box_id_in_network', ['network_type', 'box_id'])
class Box {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne((type) => Address)
  address: Address | null = null;

  @ManyToOne((type) => Tx)
  tx: Tx | null = null;

  @ManyToOne((type) => Tx, { nullable: true })
  spend_tx: Tx | null = null;

  @Column('text')
  box_id: string = '';

  @Column('text')
  network_type: string = '';

  @Column('text', { transformer: new BigIntValueTransformer() })
  erg: bigint = BigInt(0);

  @Column('int')
  create_index: number = 0;

  @Column('int')
  create_height: number = 0;

  @Column('int', { nullable: true })
  spend_index: number = 0;

  @Column('int', { nullable: true })
  spend_height: number = 0;

  @Column('int', { default: 0 })
  asset_count: number = 0;

  @Column('text')
  json: string = '';
}

export default Box;
