import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import Address from '../Address';

@ViewEntity({
  name: 'address_with_erg',
  expression: (connection: DataSource) =>
    connection
      .createQueryBuilder()
      .select('Address.id', 'id')
      .addSelect('Address.name', 'name')
      .addSelect('Address.address', 'address')
      .addSelect('Address.network_type', 'network_type')
      .addSelect('Address.path', 'path')
      .addSelect('Address.idx', 'idx')
      .addSelect('Address.walletId', 'walletId')
      .addSelect(
        '(SELECT CAST(SUM(CAST("Box"."erg" AS INT)) AS TEXT) FROM box Box WHERE Box.addressId = Address.id AND Box.spendTxId IS NULL)',
        'erg_str'
      )
      .addSelect(
        '(SELECT COUNT(DISTINCT(BoxContent.token_id)) FROM box_content BoxContent INNER JOIN box Box ON Box.id = BoxContent.boxId WHERE Box.addressId = Address.id AND Box.spendTxId IS NULL)',
        'token_count'
      )
      .from('address', 'Address'),
})
class AddressWithErg {
  @ViewColumn()
  id = 0;

  @ViewColumn()
  name = '';

  @ViewColumn()
  address = '';

  @ViewColumn()
  network_type = '';

  @ViewColumn()
  path = '';

  @ViewColumn()
  idx = 0;

  @ViewColumn()
  walletId = 0;

  @ViewColumn()
  erg_str = '';

  @ViewColumn()
  token_count = 0;

  erg = () => BigInt(this.erg_str ? this.erg_str : 0);

  addressObject = (): Address => {
    const address = {
      id: this.id,
      name: this.name,
      address: this.address,
      path: this.path,
      idx: this.idx,
    };
    return address as Address;
  };
}

export default AddressWithErg;
