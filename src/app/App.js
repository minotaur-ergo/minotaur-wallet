import React, { useEffect, useState } from "react";
// import RustTest from "./RustTest";
import WalletRouter from "../router/WalletRouter";
import * as wasm from "ergo-lib-wasm-browser";
import Database from "../db/Database";
import { Provider } from "react-redux";
import { store } from "../store";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed } from "bip32";
import { startupService } from "../actions/transaction";
// import { Address, NetworkPrefix } from "ergo-lib-wasm-browser";
// import { mnemonicToSeedSync } from "bip39";
// import { fromSeed } from "bip32";
// import * as crypto from 'crypto';
// import { Explorer, Network } from "@ergolabs/ergo-sdk";


function App() {
  useEffect(() => {
    // const mnemonic = "into salute off elephant settle boost visual into curious person chuckle gift note screen slab"
    // const seed = mnemonicToSeedSync(mnemonic, "123123")
    startupService()
    // const secret = wasm.SecretKey.dlog_from_bytes(extended.privateKey);
    // console.log("11")
    // console.log(secret.get_address().to_base58(wasm.NetworkPrefix.Mainnet))
    // console.log(extended.publicKey)
    // console.log(extended.chainCode)
    // const addr = wasm.Address.from_public_key(extended.privateKey);
    // console.log(addr.to_base58(wasm.NetworkPrefix.Mainnet))
    // const addr = Address.from_bytes(extended.chainCode)
  }, [])
  // console.log(addr.to_base58(NetworkPrefix.Mainnet))

  // const addr = wasm.Address.from_base58("9fKN5mo4AN6ERGHQ2fckroadX33M1UAADq3A4zDR461TE4JaWVw")
  // console.log(addr.to_ergo_tree().to_bytes())
  // const mnemonic = "honey monkey favorite hawk grow surge notable aspect crush famous year brother okay pass version"
  // const mnemonic_pass = "rdl6486mbvc"
  // useEffect(() => {
  //     const fn = async () => {
  //         function toHexString(byteArray) {
  //             return Array.from(byteArray, function(byte) {
  //                 return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  //             }).join('')
  //         }
  //         var explorer = new Explorer("10.10.10.4:7000")
  //         const seed = mnemonicToSeedSync(mnemonic, mnemonic_pass)
  //         const bip32 = fromSeed(seed);
  //         debugger
  //         // master secret = AAD68581CAD1542674F27C0ECFCB638CC8AF35274948EA4E1973900BF76C885F
  //         console.log(toHexString(seed).toUpperCase())
  //         console.log(bip32);
  //         const secret = wasm.SecretKey.dlog_from_bytes(seed.slice(0, 32))
  //         const address = secret.get_address().to_base58(Network.Mainnet)
  //         // const keys = new wasm.SecretKeys()
  //         // keys.add(secret)
  //         // const wallet = wasm.Wallet.from_secrets(keys)
  //         // const assress = wasm.Address.from_public_key()
  //         // const address = await wallet.getAddresses()
  //         // debugger
  //         console.log(address)
  //     }
  //     fn();
  // })
  // const wallet = wasm.Wallet.from_mnemonic(mnemonic, mnemonic_pass)
  // wallet.getAddresses(false).then(address => console.log(address)).catch(error => console.log(error))
  // useEffect(() => {
  //   loadAddressTransactions(0, "9hiQwkWrqpqpTWojqWWPPdGUi63qC4jpmkddN4amHYBwdBFLovC").then(result => {
  //     console.log(result);
  //   })
  // }, [])
  return (
    // <RustTest>testing wallets</RustTest>
    <Database>
      <Provider store={store}>
        <WalletRouter/>
      </Provider>
    </Database>
  );
}

export default App;
