import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import * as wasm from "ergo-lib-wasm-browser";
import { addAddress, getLastAddress } from "../db/commands/address";
import * as constant from '../const';


export const deriveAddress = async (wallet_id, mnemonic, password, name) => {
  debugger
  const seed = mnemonicToSeedSync(mnemonic, password)
  const index = (await getLastAddress(wallet_id)) + 1;
  const extended = fromSeed(seed).derive(index);
  const secret = wasm.SecretKey.dlog_from_bytes(extended.privateKey);
  const address = secret.get_address().to_base58(wasm.NetworkPrefix.Testnet)
  await addAddress(wallet_id, address, name, index)
  return address;
}
