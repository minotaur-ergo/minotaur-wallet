import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Wallet from './Wallet';

@Entity({ name: 'address' })
@Unique('address_network_type', ['address', 'network_type'])
class Address {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  name = '';

  @Column('text')
  address = '';

  @Column('text')
  network_type = '';

  @Column('text')
  path = '';

  @Column('int', { default: -1 })
  idx = -1;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet | null = null;

  @Column('int', { default: 0 })
  process_height = 0;
}

export default Address;
