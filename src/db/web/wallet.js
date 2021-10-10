import {database} from "../Database";
import { addAddress } from "./address";

export const createNormalWallet = async (name, mnemonic, address, path) => {
  let wallets = JSON.parse(localStorage.getItem("wallets")) || {seq: 1, wallets:[]}
  const wallet = {
    name: name,
    mnemonic: mnemonic,
    type: "normal",
    last_height: 0,
    last_update: 0,
    erg: 0,
    nano_erg: 0,
    id: wallets.seq
  }
  wallets.seq += 1;
  wallets.wallets.push(wallet);
  localStorage.setItem("wallets", JSON.stringify(wallets))
  addAddress(wallet, address, path);
}


export const loadWallets = async () => {
  const wallets = JSON.parse(localStorage.getItem("wallets")) || {seq: 0, wallets:[]}
  return wallets.wallets
    // return res.values;
}
