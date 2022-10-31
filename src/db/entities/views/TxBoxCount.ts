import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { TxStatus } from '../Tx';

@ViewEntity({
  name: 'tx_box_count',
  expression: (connection: DataSource) =>
    connection
      .createQueryBuilder()
      .select('Tx.id', 'id')
      .addSelect('Tx.tx_id', 'tx_id')
      .addSelect(
        '(SELECT count(box.id) from box WHERE box.txId = Tx.id)',
        'input_box_count'
      )
      .addSelect(
        '(SELECT count(box.id) from box WHERE box.spendTxId = Tx.id)',
        'spent_erg_str'
      )
      .from('tx', 'Tx')
      .groupBy('Tx.id'),
})
class TxBoxCount {
  @ViewColumn()
  id = 0;

  @ViewColumn()
  tx_id = '';

  @ViewColumn()
  input_box_count = 0;

  @ViewColumn()
  output_box_count = 0;
}

export default TxBoxCount;
