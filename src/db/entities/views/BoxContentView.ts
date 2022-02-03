import { Connection, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: "box_content_view",
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select('BoxContent.id', 'id')
        .addSelect('BoxContent.token_id', 'token_id')
        .addSelect('BoxContent.amount', 'amount_str')
        .addSelect('BoxContent.boxId', 'boxId')
        .addSelect('Asset.name', 'name')
        .addSelect('Asset.decimal', 'decimal')
        .addSelect('Asset.description', 'description')
        .from('box_content', 'BoxContent')
        .leftJoin('asset', 'Asset', 'Asset.asset_id = BoxContent.token_id'),
})
class BoxContentView {
    @ViewColumn()
    id: number = 0;

    @ViewColumn()
    token_id: string = '';

    @ViewColumn()
    amount_str: string = '0';

    @ViewColumn()
    boxId: string = '';

    @ViewColumn()
    name: string = '';

    @ViewColumn()
    decimal: number = 0;

    @ViewColumn()
    description: string = '';

    amount = () => BigInt(this.amount_str ? this.amount_str : 0)
}

export default BoxContentView
