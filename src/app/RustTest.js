import React from "react";
// import { ergoTreeFromAddress, RustModule, Explorer, Network, fromHex } from "@ergolabs/ergo-sdk";
// import { boxToWasm } from "@ergolabs/ergo-sdk/build/module/ergoWasmInterop";
import * as wasm from 'ergo-lib-wasm-browser'

import Explorer from "../network/Explorer";

const addresses = {
    address1: {
        secret: "17b42abec839188f816f2b0c39be2a401bb05a0a152db37e87f76bb5ae38f6db",
        address: "9fgWxhrZhv6HAYzygkT5JcKbNggu9quRAsWFmJ7V5EuyxA7Je7E"
    },
    address2: {
        secret: "a8e847fafe76a04a2359eadd33fb1a32ddec44ddc04aae83a3cbf344dcebf8c6",
        address: "9fn1pqvH3ZA6WZ1tnyv3DthKqBuSAPKjpZPvNXJNd1iCHRbnjNv"
    }
}


function getBoxValue(val) {
    return wasm.BoxValue.from_i64(wasm.I64.from_str(val.toString()))
}

function ergoTreeFromAddress(address_str) {
    return wasm.Address.from_base58(address_str).to_ergo_tree().to_base16_bytes()
}
export function fromHex(s) {
    return Uint8Array.from(Buffer.from(s, "hex"))
}

export function toHex(arr) {
    return Buffer.from(arr).toString("hex")
}
/*
7c1a96aec80011c000ef1e1d6ab7d44d490d3fec69627393aaca04119229e9e1

9602                                                                        msg to sign size
02                                                                          input size
7c1a96aec80011c000ef1e1d6ab7d44d490d3fec69627393aaca04119229e9e1 0000       input 1 zeroz indicates no proof
1954ab907e29cc82c5fb3e4392fd0b7f7265949ff7a0bbfce1f0a6fa39f0057e 0000       input 2 zeroz indicates no proof
00                                                                          indicates no box data inputs available
00                                                                          indicates no tokens available
03                                                                          output candidate count
808cee891a                                                                  first candidate value
0008cd02a5a670080865606db7b6fe14d238589a875b9cf810e55e9247b68a0dbb0d18cf    first candidate ergo tree bytes
8df103000080fbf3b4070008cd02992ac27c178c07371da6c9d623d05174e2fae90cc656346e9edf5a5a5c76f21d8df103000080ade2041005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a573048ef1030000

9602
02
7c1a96aec80011c000ef1e1d6ab7d44d490d3fec69627393aaca04119229e9e1 0000
1954ab907e29cc82c5fb3e4392fd0b7f7265949ff7a0bbfce1f0a6fa39f0057e 0000
00
00
03
808cee891a
0008cd02a5a670080865606db7b6fe14d238589a875b9cf810e55e9247b68a0dbb0d18cf
8df103000080fbf3b4070008cd02a5a670080865606db7b6fe14d238589a875b9cf810e55e9247b68a0dbb0d18cf8df103000080ade2041005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a573048df1030000
 */

class RustTest extends React.Component {
    createTx = async () => {
        const explorer = new Explorer("http://10.10.10.4:7000")
        const inputBoxes = await explorer.getUnspentByAddress(addresses.address1.address, 0, 100);
        const inputs = new wasm.BoxSelection(inputBoxes, new wasm.ErgoBoxAssetsDataList())
        const outs = wasm.ErgoBoxCandidates.empty();
        outs.add(new wasm.ErgoBoxCandidateBuilder(
            getBoxValue(7e9),
            wasm.Contract.pay_to_address(wasm.Address.from_base58(addresses.address2.address)),
            63686
        ).build())
        outs.add(new wasm.ErgoBoxCandidateBuilder(
            getBoxValue(9e9-7e9-1e7),
            wasm.Contract.pay_to_address(wasm.Address.from_base58(addresses.address1.address)),
            63686
        ).build())
        const txBuilder = wasm.TxBuilder.new(
            inputs,
            outs,
            63686,
            getBoxValue(1e7),
            wasm.Address.from_base58(addresses.address1.address),
            wasm.BoxValue.SAFE_USER_MIN()
        )
        const tx = txBuilder.build()
        console.log(tx.to_json())
        const secret = wasm.SecretKey.dlog_from_bytes(fromHex(addresses.address1.secret))
        const secrets = new wasm.SecretKeys();
        secrets.add(secret)
        const wallet = wasm.Wallet.from_secrets(secrets)
        const ctx = wasm.ErgoStateContext.dummy();
        console.log(toHex(wallet.reduce_transaction(ctx, tx, inputs.boxes(), wasm.ErgoBoxes.from_boxes_json([]))))
        const signedTx = await wallet.sign_transaction(
            ctx,
            tx,
            inputs.boxes(),
            wasm.ErgoBoxes.from_boxes_json([])
        )
        console.log(signedTx)
    }

    componentDidMount = () => {
        this.createTx();
    }

    render = () => {
        return (
            <div style={{textAlign: 'center', marginTop: 100}}>
                salam
            </div>
        )
    }
}

export default RustTest
