import * as wasm from 'ergo-lib-wasm-browser';

import { BoxInfo, TokenInfo } from './db';
import { SpendDetail } from './tx';

interface BalanceInfo {
  nanoErgs: bigint;
  tokens: Array<{
    id: string;
    amount: bigint;
  }>;
}

abstract class AbstractNetwork {
  abstract getHeight: () => Promise<number>;

  abstract getAddressTransactionCount: (address: string) => Promise<number>;

  abstract getContext: () => Promise<wasm.ErgoStateContext>;

  abstract sendTx: (tx: wasm.Transaction) => Promise<{ txId: string }>;

  abstract getAddressInfo: (address: string) => Promise<BalanceInfo>;

  abstract getAssetDetails: (assetId: string) => Promise<TokenInfo>;

  abstract getBoxById: (boxId: string) => Promise<wasm.ErgoBox | undefined>;

  abstract syncBoxes: (
    address: string,
    addressHeight: number,
    updateAddressHeight: (height: number) => Promise<unknown>,
    insertOrUpdateBox: (box: BoxInfo) => Promise<unknown>,
    spendBox: (boxId: string, details: SpendDetail) => Promise<unknown>,
  ) => Promise<boolean>;

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

interface ChainTypeInterface {
  readonly prefix: wasm.NetworkPrefix;
  readonly label: string;

  getNetwork: () => AbstractNetwork;
  getExplorerFront: () => string;
  fakeContext: () => wasm.ErgoStateContext;
}

export { ChainTypeInterface, BalanceInfo, AbstractNetwork, TokenInfo };
