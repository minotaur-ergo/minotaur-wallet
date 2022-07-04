import { DataSource, ViewColumn, ViewEntity } from "typeorm";


@ViewEntity({
    name: "asset_count_boxes",
    expression: (dataSource: DataSource) => dataSource.createQueryBuilder()
        .select('Box.id', 'id')
        .addSelect('COUNT(BoxContent.id)', 'inserted')
        .addSelect('Box.asset_count', 'total')
        .from('box', 'Box')
        .innerJoin('box_content', 'BoxContent', 'Box.id = BoxContent.boxId')
        .addGroupBy('Box.id')
})
class AssetCountBox {
    @ViewColumn()
    id: number = 0;

    @ViewColumn()
    inserted: string = '';

    @ViewColumn()
    total: number = 0;
}

export default AssetCountBox;
