import React from "react";
import WalletList from "./WalletList";
import WithAppBar from "../../layout/WithAppBar";
import HomeHeader from "./HomeHeader";
import { mnemonicToSeedSync } from "bip39";
import { fromSeed, fromBase58 } from "bip32";
import { calcPathFromIndex } from "../../action/address";
import * as crypto from "crypto";
import * as wasm from "ergo-lib-wasm-browser";

const Home = () => {
    const mnemonic = "nominee pretty fabric dance opinion lemon attend garden market rally bread own own material icon";
    const seed = mnemonicToSeedSync(mnemonic, "");
    const path = calcPathFromIndex(9);
    const master = fromSeed(seed);//.derivePath(path);
    const pub1 = master.derivePath(path.substr(0, path.length - 2)).neutered();
    const base58 = pub1.toBase58();
    const pub = fromBase58(base58);
    const derived1 = pub.derive(9);
    const derived2 = master.derivePath(path);
    const address1 = wasm.Address.from_public_key(Uint8Array.from(derived1.publicKey)).to_base58(wasm.NetworkPrefix.Mainnet);
    const secret = wasm.SecretKey.dlog_from_bytes(Uint8Array.from(derived2.privateKey!));
    console.log(address1);
    console.log(secret.get_address().to_base58(wasm.NetworkPrefix.Mainnet));

    return (
        <WithAppBar header={<HomeHeader />}>
            <WalletList />
        </WithAppBar>
    );
};

export default Home;
