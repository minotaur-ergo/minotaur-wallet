import { database } from "../Database";

export const insertTransaction = async (tx_id, height, date, tx) => {
  if(await getTransaction(tx_id)) {
    const query = `INSERT INTO tx (tx_id, height, date, json) VALUES ('${tx_id}', '${height}' ,'${date}', '${tx}');`
    await database.execute(query);
  }
}

export const getTransaction = async tx_id => {
  const transactions =localStorage.getItem("transactions") || {seq: 0, tx: []}
  const query = `SELECT * from tx where tx_id = ?`
  const res = await database.query(query, [tx_id]);
  const values = res.values;
  return values.length >= 1 ? values[0] : null;
}
