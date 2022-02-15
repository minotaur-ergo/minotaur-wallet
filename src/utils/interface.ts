import * as wasm from 'ergo-lib-wasm-browser';
import { NetworkType } from "../config/network_type";
import Wallet from "../db/entities/Wallet";

export interface CoveringResult {
    covered: boolean;
    boxes: wasm.ErgoBoxes;
}

export interface DAppPropsType {
    getAddresses: () => Promise<Array<string>>;
    getCoveringForErgAndToken: (amount: bigint, tokens: Array<{id: string, amount: bigint}>, address?: string) => Promise<CoveringResult>;
    signAndSendTx: (unsignedTx: UnsignedGeneratedTx) => Promise<any>;
    network_type: NetworkType,
    getTokenAmount: (tokenId?: string) => Promise<bigint>;
}

export type UnsignedGeneratedTx = {
    tx: wasm.UnsignedTransaction | wasm.ReducedTransaction;
    boxes: wasm.ErgoBoxes;
    data_inputs?: wasm.ErgoBoxes;
}

export interface WalletPagePropsType {
    wallet: Wallet;
    setTab: (name: string) => any;
}
