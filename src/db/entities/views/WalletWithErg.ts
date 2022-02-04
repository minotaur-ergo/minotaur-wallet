import { Connection, ViewColumn, ViewEntity } from 'typeorm';
import { WalletType } from '../Wallet';

@ViewEntity({
    name: "wallet_with_erg",
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select('Wallet.id', 'id')
        .addSelect('Wallet.name', 'name')
        .addSelect('Wallet.seed', 'seed')
        .addSelect('Wallet.network_type', 'network_type')
        .addSelect('Wallet.extended_public_key', 'extended_public_key')
        .addSelect('Wallet.type', 'type')
        .addSelect('CAST(SUM(CAST(Box.erg AS INT)) AS TEXT)', 'erg_str')
        .addSelect('Count(DISTINCT BoxContent.token_id)', 'token_count')
        .leftJoin('address', 'Address', 'Address.walletId=Wallet.id')
        .leftJoin('box', 'Box', 'Box.addressId=Address.id')
        .leftJoin('box_content', 'BoxContent', 'Box.id=BoxContent.boxId')
        .from('wallet', 'Wallet')
        .where('Box.spend_tx IS NULL')
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
    erg = () => BigInt(this.erg_str ? this.erg_str : 0)

}

export default WalletWithErg
