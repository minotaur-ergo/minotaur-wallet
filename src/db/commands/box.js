import { JSONBigInt } from "../../network/Explorer";
import { database } from "../Database";

export const addBox = async (tx_id, address_id, index, box_json) => {
  const box_id = box_json.boxId;
  if((await getBoxById(box_id)) == null) {
    const erg = Math.floor(box_json.value / 1e9);
    const nano_erg = box_json.value % 1e9;
    const address = box_json.address;
    const box = JSONBigInt.stringify(box_json)
    const query = `INSERT INTO box (tx_id, erg, nano_erg, creation_index, address, box_id, json)
    VALUES (${tx_id}, ${erg}, ${nano_erg}, ${index}, '${address_id}', '${box_id}', '${box}')
    `
    await database.execute(query);
  }
}

export const getBoxById = async (boxId) => {
  const query = `SELECT * FROM box WHERE box_id=?`
  const res = await database.query(query, [boxId])
  const values = res.values;
  return values.length > 0 ? values[0] : null
}
export const spentBox = async (box_id, tx_id, spend_index) => {
  const query = `
    UPDATE box SET spend_tx_id=${tx_id}, spend_index=${spend_index} where box_id='${box_id}'
  `
  database.execute(query);
}


export const getWalletBox = async(wallet_id) => {
  const query = `
            SELECT DISTINCT box.* FROM box
            INNER JOIN address ON box.address = address.id
            INNER JOIN wallet ON wallet.id = address.wallet
        `
  const res = await database.query(query);
  return res.values;

}
