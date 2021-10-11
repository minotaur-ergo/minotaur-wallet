import {database} from "../Database";
import { deriveAddress } from "../../actions/address";

export const createNormalWallet = async (name, mnemonic, password) => {
    const walletType = 'normal'
    const query = `
            INSERT INTO wallet (name, mnemonic, type)
            VALUES ('${name}', '${mnemonic}' ,'${walletType}');
            `
    await database.execute(query);
    const cursor = await database.query('SELECT id FROM wallet Where mnemonic = ? AND type = ?', [mnemonic, walletType]);
    const walletId = cursor.values[0].id;
    await deriveAddress(walletId, mnemonic, password, "Main Address")
}


export const loadWallets = async () => {
    const query = `
            SELECT wallet.*, SUM(box.erg) AS erg, SUM(box.nano_erg) AS nano_erg  FROM wallet
            INNER JOIN address ON wallet.id = address.wallet
            LEFT OUTER  JOIN box ON box.address = address.id
            GROUP By wallet.id
        `
    const res = await database.query(query);
    return res.values;
}
