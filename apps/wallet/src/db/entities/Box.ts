import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Unique } from 'typeorm/browser';

import Address from './Address';

@Entity({ name: 'box' })
@Unique('box_id_for_address', ['address', 'box_id'])
class Box {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Address)
  address: Address | null = null;

  @Column('text')
  tx_id = '';

  @Column('text', { nullable: true })
  spend_tx_id: string | null = null;

  @Column('text')
  box_id = '';

  @Column('int')
  create_index = 0;

  @Column('int')
  create_height = 0;

  @Column('int')
  create_timestamp = 0;

  @Column('int', { nullable: true })
  spend_index?: number;

  @Column('int', { nullable: true })
  spend_height?: number;

  @Column('int', { nullable: true })
  spend_timestamp?: number;

  @Column('text')
  serialized = '';
}

export default Box;
