import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Unique } from 'typeorm/browser';

@Entity({ name: 'box_spend' })
@Unique('box_id_for_network', ['network_type', 'box_id'])
class BoxSpend {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  network_type = '';

  @Column('text')
  box_id = '';

  @Column('text')
  spend_tx_id: string;

  @Column('int')
  spend_index: number;

  @Column('int')
  spend_height: number;

  @Column('int')
  spend_timestamp: number;
}

export default BoxSpend;
