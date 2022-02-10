import * as wasm from "ergo-lib-wasm-browser";
import { is_valid_address, sum_erg_and_nano_erg } from "../utils/utils";
import { FEE } from "../config/const";
import * as dbAddressAction from "../db/action/address";
import { getCoveringBoxFor } from "../db/action/box";
import Wallet from "../db/entities/Wallet";
import Address from "../db/entities/Address";
import { getWalletAddressSecret } from "./address";
import Asset from "../db/entities/Asset";
import { getAssetByAssetId } from "../db/action/asset";
import { getNode } from "../network/node";

class ReceiverToken {
    readonly token_id: string;
    amount_str: string;
    private asset?: Asset;
    private readonly network_type: string;

    constructor(token_id: string, amount: string, network_type: string, asset?: Asset) {
        this.token_id = token_id;
        this.amount_str = amount;
        this.network_type = network_type;
        if (asset) {
            this.asset = asset;
        } else {
            getAssetByAssetId(this.token_id, this.network_type).then(asset => this.asset = asset);
        }
    }

    clone = () => {
        return new ReceiverToken(this.token_id, this.amount_str, this.network_type, this.asset);
    };

    amount = () => {
        const parts = this.amount_str.split(".");
        const decimal_point = this.asset && this.asset.decimal ? this.asset.decimal : 0;
        const count_str = parts[0];
        let decimal_count = parts[1] ? parts[1] : "0";
        decimal_count = decimal_count.padEnd(decimal_point, "0").substr(0, decimal_point);
        return BigInt(count_str + decimal_count);
    };

    valid = () => {
        const valid_id = this.token_id.length === 64;
        const valid_amount = !isNaN(Number(this.amount_str));
        return valid_id && valid_amount;
    };
}

class Receiver {
    address: string = "";
    erg_str: string = "";
    tokens: Array<ReceiverToken> = [];

    clone = () => {
        const res = new Receiver(this.address, this.erg_str);
        this.tokens.forEach(token => res.tokens.push(token.clone()));
        return res;
    };
    erg = () => {
        const parts = this.erg_str.split(".");
        const ergStr = parts[0];
        let nanoErgStr = parts[1] ? parts[1] : "0";
        while (nanoErgStr.length < 9) {
            nanoErgStr += "0";
        }
        return sum_erg_and_nano_erg(Number(ergStr), Number(nanoErgStr));
    };

    constructor(address: string, erg: string) {
        this.address = address;
        this.erg_str = erg;
    }

    valid = () => {
        const valid_address = is_valid_address(this.address);
        const valid_amount = !isNaN(Number(this.erg_str)) && this.erg_str !== "";
        const valid_token = this.tokens.filter(item => !item.valid()).length === 0;
        return valid_address && valid_amount && valid_token;
    };
}

export type UnsignedGeneratedTx = {
    tx: wasm.UnsignedTransaction | wasm.ReducedTransaction;
    boxes: wasm.ErgoBoxes;
    data_inputs?: wasm.ErgoBoxes;
}

const bigintToBoxValue = (num: bigint) => wasm.BoxValue.from_i64(wasm.I64.from_str(num.toString()));

const getReceiverAmount = (receivers: Array<Receiver>) => receivers.map(receiver => receiver.erg()).reduce((a, b) => a + b);

const createContext = async (network_type: string) => {
    const node = getNode(network_type);
    const networkContext = await node.getNetworkContext();
    const blockHeaders = wasm.BlockHeaders.from_json(networkContext.lastBlocks);
    const pre_header = wasm.PreHeader.from_block_header(blockHeaders.get(0));
    return new wasm.ErgoStateContext(pre_header, blockHeaders);
};

const createTx = async (receivers: Array<Receiver>, wallet: Wallet, inputAddress?: Address): Promise<UnsignedGeneratedTx> => {
    const node = getNode(wallet.network_type);
    const height = await node.getHeight();
    let totalRequired = getReceiverAmount(receivers) + FEE;
    let candidates: wasm.ErgoBoxCandidates = wasm.ErgoBoxCandidates.empty();
    const tokens: { [id: string]: bigint } = {};
    receivers.forEach(receiver => {
        const contract = wasm.Contract.pay_to_address(wasm.Address.from_base58(receiver.address));
        const boxBuilder = new wasm.ErgoBoxCandidateBuilder(bigintToBoxValue(receiver.erg()), contract, height);
        receiver.tokens.forEach(item => {
            if (tokens.hasOwnProperty(item.token_id)) {
                tokens[item.token_id] = tokens[item.token_id] + item.amount();
            } else {
                tokens[item.token_id] = item.amount();
            }
            boxBuilder.add_token(wasm.TokenId.from_str(item.token_id), wasm.TokenAmount.from_i64(wasm.I64.from_str(item.amount().toString())));
        });
        candidates.add(boxBuilder.build());
    });
    const addresses = await dbAddressAction.getWalletAddressesWithoutErg(wallet.id);
    const address = inputAddress ? inputAddress : addresses[0];
    const coveringBoxes = await getCoveringBoxFor(totalRequired, wallet.id, tokens, inputAddress);
    if (coveringBoxes.covered) {
        const tokenSelection = new wasm.Tokens();
        Object.keys(tokens).forEach(token_id => tokenSelection.add(
            new wasm.Token(wasm.TokenId.from_str(token_id), wasm.TokenAmount.from_i64(wasm.I64.from_str(tokens[token_id].toString())))
        ));
        const boxSelector = new wasm.SimpleBoxSelector();
        const selected = boxSelector.select(coveringBoxes.boxes, wasm.BoxValue.from_i64(wasm.I64.from_str(totalRequired.toString())), tokenSelection);
        const tx = wasm.TxBuilder.new(
            selected,
            candidates,
            height,
            bigintToBoxValue(FEE),
            wasm.Address.from_base58(address.address),
            bigintToBoxValue(FEE)
        ).build();
        return {
            tx: tx,
            boxes: coveringBoxes.boxes
        };
    }
    throw Error("Insufficient erg or token to generate transaction");
};

const reduceTransaction = async (tx: wasm.UnsignedTransaction, boxes: wasm.ErgoBoxes, data_boxes: wasm.ErgoBoxes, network_type: string) => {
    const ctx = await createContext(network_type);
    const reduced_transaction = wasm.ReducedTransaction.from_unsigned_tx(tx, boxes, data_boxes, ctx);
    return reduced_transaction.sigma_serialize_bytes();
};

const signReduceTransaction = async (txBytes: Uint8Array, dbWallet: Wallet, password: string) => {
    const tx = wasm.ReducedTransaction.sigma_parse_bytes(txBytes);
    const addresses = await dbAddressAction.getWalletAddressesWithoutErg(dbWallet.id);
    const secretKeys = new wasm.SecretKeys();
    for (let addr of addresses) {
        secretKeys.add(await getWalletAddressSecret(dbWallet, password, addr));
    }
    const wallet = wasm.Wallet.from_secrets(secretKeys);
    const signedTx = wallet.sign_reduced_transaction(tx);
    signedTx.to_json();
};

const signTx = async (dbWallet: Wallet, tx: UnsignedGeneratedTx, password: string) => {
    const addresses = await dbAddressAction.getWalletAddressesWithoutErg(dbWallet.id);
    const secretKeys = new wasm.SecretKeys();
    for (let addr of addresses) {
        secretKeys.add(await getWalletAddressSecret(dbWallet, password, addr));
    }

    const wallet = wasm.Wallet.from_secrets(secretKeys);
    if (tx.tx instanceof wasm.ReducedTransaction) {
        return wallet.sign_reduced_transaction(tx.tx);
    } else {
        const data_inputs = tx.data_inputs ? tx.data_inputs : wasm.ErgoBoxes.from_boxes_json([])
        return wallet.sign_transaction(await createContext(dbWallet.network_type), tx.tx, tx.boxes, data_inputs);
    }
};
export {
    Receiver,
    ReceiverToken,
    createTx,
    signTx,
    reduceTransaction,
    signReduceTransaction
};
