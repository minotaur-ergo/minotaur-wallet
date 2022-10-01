import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { WalletType } from '../Wallet';

@ViewEntity({
  name: 'address_token_id',
  expression: (connection: DataSource) =>
    connection
      .createQueryBuilder()
      .select('Address.id', 'id')
      .addSelect('BoxContent.token_id', 'token_id')
      .from('address', 'Address')
      .leftJoin('box', 'Box', 'Box.addressId=Address.id')
      .leftJoin('box_content', 'BoxContent', 'Box.id=BoxContent.boxId')
      .where('Box.spend_tx IS NULL'),
})
export class AddressTokenId {
  @ViewColumn()
  id: number = 0;

  @ViewColumn()
  token_id: string = '';
}

@ViewEntity({
  name: 'wallet_with_erg',
  expression: (connection: DataSource) =>
    connection
      .createQueryBuilder()
      .select('Wallet.id', 'id')
      .addSelect('Wallet.name', 'name')
      .addSelect('Wallet.seed', 'seed')
      .addSelect('Wallet.network_type', 'network_type')
      .addSelect('Wallet.extended_public_key', 'extended_public_key')
      .addSelect('Wallet.type', 'type')
      .addSelect(
        '(SELECT CAST(SUM(CAST("address_with_erg"."erg_str" AS INT)) AS TEXT) from address_with_erg WHERE address_with_erg.walletId=Wallet.id)',
        'erg_str'
      )
      .addSelect('Count(DISTINCT TokenId.token_id)', 'token_count')
      .leftJoin('address_with_erg', 'Address', 'Address.walletId=Wallet.id')
      .leftJoin('address_token_id', 'TokenId', 'TokenId.id=Address.id')
      .from('wallet', 'Wallet')
      .groupBy('Wallet.id'),
})
export class WalletWithErg {
  @ViewColumn()
  id: number = 0;

  @ViewColumn()
  name: string = '';

  @ViewColumn()
  network_type: string = '';

  @ViewColumn()
  seed: string = '';

  @ViewColumn()
  extended_public_key: string = '';

  @ViewColumn()
  type: WalletType = WalletType.Normal;

  @ViewColumn()
  erg_str: bigint | null = BigInt(0);

  @ViewColumn()
  token_count: number = 0;
  erg = () => BigInt(this.erg_str ? this.erg_str : 0);
}

export default WalletWithErg;
