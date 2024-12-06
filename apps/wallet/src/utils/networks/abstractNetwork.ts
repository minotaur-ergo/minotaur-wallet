import * as wasm from 'ergo-lib-wasm-browser';
import Address from '@/db/entities/Address';
import { TokenInfo } from '@/types/db';
import { BalanceInfo } from './interfaces';

export abstract class AbstractNetwork {
  abstract getHeight: () => Promise<number>;

  abstract getAddressTransactionCount: (address: string) => Promise<number>;

  abstract getContext: () => Promise<wasm.ErgoStateContext>;

  abstract sendTx: (tx: wasm.Transaction) => Promise<{ txId: string }>;

  abstract getAddressInfo: (address: string) => Promise<BalanceInfo>;

  abstract getAssetDetails: (assetId: string) => Promise<TokenInfo>;

  abstract getBoxById: (boxId: string) => Promise<wasm.ErgoBox | undefined>;

  abstract syncBoxes: (address: Address) => Promise<boolean>;

  abstract getTransaction: (txId: string) => Promise<{
    tx?: wasm.Transaction;
    date: string;
    boxes: Array<wasm.ErgoBox>;
  }>;

  abstract getUnspentBoxByTokenId: (
    tokenId: string,
    offset: number,
    limit: number,
  ) => Promise<Array<wasm.ErgoBox>>;

  abstract trackMempool: (box: wasm.ErgoBox) => Promise<wasm.ErgoBox>;
}
