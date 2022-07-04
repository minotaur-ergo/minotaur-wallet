import { DataSource, ViewColumn, ViewEntity } from "typeorm";


@ViewEntity({
    name: "token_with_address",
    expression: (connection: DataSource) => connection.createQueryBuilder()
        .select('BoxContent.token_id', 'token_id')
        .addSelect('CAST(SUM(CAST("BoxContent"."amount" AS INT)) AS TEXT)', 'amount_str')
        .addSelect('Address.id', 'address_id')
        .addSelect('Address.walletId', 'wallet_id')
        .from('box_content', 'BoxContent')
        .innerJoin('box', 'Box', 'Box.id = BoxContent.boxId')
        .innerJoin('address', 'Address', 'Box.addressId = Address.id')
        .where('Box.spend_tx IS NULL')
        .addGroupBy('address_id, token_id, wallet_id')
})
class TokenWithAddress{
    @ViewColumn()
    token_id: string = "";

    @ViewColumn()
    amount_str: string = '';

    @ViewColumn()
    address_id: number = 0;

    @ViewColumn()
    wallet_id: number = 0;

    amount = () => BigInt(this.amount_str ? this.amount_str : 0)
}

export default TokenWithAddress;
