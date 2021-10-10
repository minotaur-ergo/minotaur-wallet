import React, { useEffect, useState } from "react";
// import RustTest from "./RustTest";
import WalletRouter from "../router/WalletRouter";
// import * as wasm from "ergo-lib-wasm-browser";
import Database from "../db/Database";
import { Provider } from "react-redux";
import { store } from "../store";
// import { mnemonicToSeedSync } from "bip39";
// import { fromSeed } from "bip32";
// import * as crypto from 'crypto';
// import { Explorer, Network } from "@ergolabs/ergo-sdk";
/*
* 9602027c1a96aec80011c000ef1e1d6ab7d44d490d3fec69627393aaca04119229e9e100001954ab907e29cc82c5fb3e4392fd0b7f7265949ff7a0bbfce1f0a6fa39f0057e0000000003808cee891a0008cd02a5a670080865606db7b6fe14d238589a875b9cf810e55e9247b68a0dbb0d18cf8df103000080ade2041005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a573048df103000080fbf3b4070008cd02992ac27c178c07371da6c9d623d05174e2fae90cc656346e9edf5a5a5c76f21d8df1030000cd02992ac27c178c07371da6c9d623d05174e2fae90cc656346e9edf5a5a5c76f21d9d4fcd02992ac27c178c07371da6c9d623d05174e2fae90cc656346e9edf5a5a5c76f21d9d4fdc6f
* */
function App() {
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
