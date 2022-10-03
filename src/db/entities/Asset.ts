import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'asset' })
@Unique('asset_id_network_type', ['asset_id', 'network_type'])
class Asset {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  asset_id = '';

  @Column('text')
  network_type = '';

  @Column('text', { nullable: true })
  box_id?: string = '';

  @Column('text', { nullable: true })
  name?: string = '';

  @Column('int', { nullable: true, default: 0 })
  decimal?: number = 0;

  @Column('text', { nullable: true })
  description?: string = '';
}

export default Asset;
