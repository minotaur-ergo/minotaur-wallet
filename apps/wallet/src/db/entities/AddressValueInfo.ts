import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Unique } from 'typeorm';

import Address from './Address';
import BigIntValueTransformer from './Transformer';

enum AddressValueType {
  Confirmed = 'CONFIRMED',
  Unconfirmed = 'UNCONFIRMED',
}

@Entity({ name: 'address_value_info' })
@Unique(['token_id', 'address', 'type'])
class AddressValueInfo {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  token_id = '';

  @Column('text', { transformer: new BigIntValueTransformer() })
  amount = BigInt(0);

  @Column('text')
  type: AddressValueType = AddressValueType.Confirmed;

  @ManyToOne(() => Address, { onDelete: 'CASCADE' })
  address: Address | null = null;
}

export default AddressValueInfo;

export { AddressValueType };
