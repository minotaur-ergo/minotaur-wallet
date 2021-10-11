import { database } from "../Database";


export const addAddress = async (wallet_id, address, name, index) => {
  const query = `INSERT INTO address (name, wallet, address, path) VALUES ('${name}', ${wallet_id}, '${address}', '${index}')`;
  database.execute(query);
}

export const getWalletAddresses = async wallet => {
  const query = `SELECT * FROM address WHERE wallet = ? ORDER BY path`
  const res = await database.query(query, [wallet.id])
  return res.values
}


export const filterAddress = async address_id => {
  const query = `SELECT * FROM address WHERE id = ? ORDER BY path`
  const res = await database.query(query, [address_id])
  const addresses = res.values
  if(addresses.length > 0) return addresses[0];
  return {};
}

export const getLastAddress = async wallet_id => {
  const query = `SELECT max(path) AS mxx FROM address WHERE wallet = ?`
  const res = await database.query(query, [wallet_id])
  const addresses = res.values
  if(addresses.length > 0) return addresses[0].mxx;
  return -1;
}


export const getAllAddressesExceptCold = async () => {
  const query = `SELECT wallet.id, address, last_height FROM address INNER JOIN wallet ON wallet.id = address.wallet WHERE wallet.type <> 'cold'`;
  const res = await database.query(query);
  return res.values;
}
