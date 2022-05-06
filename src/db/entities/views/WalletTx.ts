import { Connection, ViewColumn, ViewEntity } from 'typeorm';
import { TxStatus } from '../Tx';

@ViewEntity({
    name: "wallet_tx",
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select('Tx.id', 'id')
        .addSelect('Tx.tx_id', 'tx_id')
        .addSelect('Tx.height', 'height')
        .addSelect('Tx.network_type', 'network_type')
        .addSelect('Tx.date', 'date')
        .addSelect('Tx.status', 'status')
        .addSelect('CreateAddress.walletId', 'create_wallet_id')
        .addSelect('SpentAddress.walletId', 'spent_wallet_id')
        .addSelect('(SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.txId = Tx.id)', 'create_erg_str')
        .addSelect('(SELECT CAST(SUM(CAST(erg AS INT)) AS TEXT) from box WHERE box.spendTxId = Tx.id)', 'spent_erg_str')
        .from('tx', 'Tx')
        .leftJoin('box', 'CreateBox', 'CreateBox.txId = Tx.id')
        .leftJoin('address', 'CreateAddress', 'CreateAddress.id=CreateBox.addressId')
        .leftJoin('box', 'SpentBox', 'SpentBox.spend_tx = Tx.id')
        .leftJoin('address', 'SpentAddress', 'SpentAddress.id=SpentBox.addressId')
        .groupBy("Tx.id")
        .orderBy("date", 'DESC')
        // .addGroupBy("CreateAddress.walletId")
        // .addGroupBy("SpentAddress.walletId"),
})
class WalletTx {
    @ViewColumn()
    id: number = 0;

    @ViewColumn()
    tx_id: string = '';

    @ViewColumn()
    height: number = 0;

    @ViewColumn()
    network_type: string = '';

    @ViewColumn()
    date: number = 0;

    @ViewColumn()
    status: TxStatus = TxStatus.New;

    @ViewColumn()
    create_wallet_id: number = 0;

    @ViewColumn()
    spent_wallet_id: number | null = 0;

    @ViewColumn()
    create_erg_str: string = "0";

    @ViewColumn()
    spent_erg_str: string = "0";

    create_erg = () => BigInt(this.create_erg_str ? this.create_erg_str : 0)

    spent_erg = () => BigInt(this.spent_erg_str ? this.spent_erg_str : 0)
}

export default WalletTx;
