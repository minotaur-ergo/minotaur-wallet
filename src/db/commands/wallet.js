import {database} from "../Database";

export const createNormalWallet = async (name, mnemonic, extendedPublicKey, address, path) => {
    const walletType = 'normal'
    const query = `
            INSERT INTO wallet (name, mnemonic, type, extended_public_key)
            VALUES ('${name}', '${mnemonic}' ,'${walletType}' ,'${extendedPublicKey}');
            `
    await database.execute(query);
    const cursor = await database.query('SELECT id FROM wallet Where mnemonic = ? AND type = ?', [mnemonic, walletType]);
    const walletId = cursor.values[0].id;
    const addressQuery = `
            INSERT INTO address (wallet, readonly, address, path) 
            VALUES (${walletId}, 0, '${address}', '${path}');
    `
    await database.execute(addressQuery)
}


export const selectWallet = async () => {
    const query = `
            SELECT wallet.*, SUM(box.erg) AS erg, SUM(box.nano_erg) AS nano_erg  FROM wallet
            LEFT OUTER JOIN address ON wallet.id = address.wallet
            LEFT OUTER  JOIN box ON box.address = address.id
            GROUP By wallet.id
        `
    const res = await database.query(query);
    return res.values;
}
