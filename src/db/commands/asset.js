import { database } from "../Database";

export const getAssetByHash = async asset_id => {
  const query = `SELECT * FROM asset WHERE asset_id=?`
  const cur = await database.query(query, [asset_id]);
  const res = cur.values
  if(res.length > 0){
    return res[0];
  }
  return null;
}

export const getAssetById = async id => {
  const query = `SELECT * FROM asset WHERE id=?`
  const cur = await database.query(query, [id]);
  const res = cur.values
  if(res.length > 0){
    return res[0];
  }
  return null;
}

export const mapAssets = async () => {
  const cur = await database.query(`SELECT id, asset_id from asset`);
  let res = {}
  cur.values.forEach(item => {
    res[item.asset_id] = item.id
  })
  return res;
}


export const insertAsset = async (asset_id, name, decimal) => {
  let asset = getAssetByHash(asset_id)
  if(asset == null){
    const query = `INSERT INTO asset (asset_id, name, decimal) VALUES ('${asset_id}', '${name}', ${decimal})`
    database.execute(query);
    asset = getAssetByHash(asset_id)
  }
  return asset;
}
