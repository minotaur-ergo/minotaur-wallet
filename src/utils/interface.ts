import * as wasm from 'ergo-lib-wasm-browser';
import { UnsignedGeneratedTx } from "../action/blockchain";
import { NetworkType } from "../config/network_type";

export interface CoveringResult {
    covered: boolean;
    boxes: wasm.ErgoBoxes;
}

export interface DAppPropsType {
    getAddresses: () => Promise<Array<string>>;
    getCoveringForErgAndToken: (amount: bigint, tokens: Array<{id: string, amount: bigint}>, address?: string) => Promise<CoveringResult>;
    signAndSendTx: (unsignedTx: UnsignedGeneratedTx) => Promise<any>;
    network_type: NetworkType
}
