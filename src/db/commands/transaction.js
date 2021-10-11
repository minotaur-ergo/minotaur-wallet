import { database } from "../Database";
import JSONBigIntgInt from "json-bigint"

export const insertTransaction = async (tx_id, height, date, tx) => {
  if((await getTransaction(tx_id)) === null) {
    const tx_str = JSONBigIntgInt.stringify(tx)
    const query = `INSERT INTO tx (tx_id, height, date, json) VALUES ('${tx_id}', '${height}' ,'${date}', '${tx_str}');`
    await database.execute(query);
  }
}

export const getTransaction = async tx_id => {
  const query = `SELECT * from tx where tx_id = ?`
  const res = await database.query(query, [tx_id]);
  const values = res.values;
  console.log("fetched transaction is ", JSON.stringify(values));
  return values.length >= 1 ? values[0] : null;
}

export const getWalletTransactions = async wallet_id => {
  const query = `
        SELECT DISTINCT tx.*, box.spend_tx_id, box.tx_id, box.erg, box.nano_erg FROM tx, box, address
        WHERE (box.tx_id = tx.id OR box.spend_tx_id = tx.id)
        AND address.id = box.address
        AND address.wallet = ?
        ORDER BY tx.height DESC
`
  const res = await database.query(query, [wallet_id])
  let result_json = []
  let tx_map = {}
  res.values.forEach(tx_row => {
    const dir = tx_row.spend_tx_id === tx_row.id ? "out" : "in"
    if(tx_row.id in tx_map){
      let output_row = result_json[tx_map[tx_row.id]];
      if(output_row.type === dir){
        output_row.erg += tx_row.erg
        output_row.nano_erg += tx_row.nano_erg;
      }else{
        if(output_row.erg > tx_row.erg || (output_row.erg === tx_row.erg && output_row.nano_erg >= tx_row.nano_erg)){
          output_row.erg -= tx_row.erg;
          output_row.nano_erg -= tx_row.nano_erg;
        } else {
          output_row.erg = tx_row.erg - output_row.erg;
          output_row.nano_erg = tx_row.nano_erg - output_row.nano_erg;
          output_row.type = dir
        }
      }
    }else{
      const output_row = {"id": tx_row.id, "time": tx_row.date, "type": dir, "amount": {"erg": tx_row.erg, "nano_erg": tx_row.nano_erg}}
      tx_map[tx_row.id] = result_json.length
      result_json.push(output_row)
    }
  })
  return result_json;
}


export const prune = async () => {
  const query = `
DELETE FROM box;
  DELETE FROM tx;
  `
  await database.execute(query);
}
