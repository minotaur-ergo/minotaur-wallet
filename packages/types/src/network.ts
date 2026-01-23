import * as wasm from '@minotaur-ergo/ergo-lib';

import { BoxInfo, TokenInfo } from './db';
import { SpendDetail } from './tx';

const EXPLORER_NETWORK = 'Explorer';
const NODE_NETWORK = 'Node';

enum NETWORK_BACKEND {
  NODE = NODE_NETWORK,
  EXPLORER = EXPLORER_NETWORK,
}

interface BalanceInfo {
  nanoErgs: bigint;
  tokens: Array<{
    id: string;
    amount: bigint;
  }>;
}

interface BlockHeader {
  id: string;
  timestamp: bigint;
  version: number;
  adProofsRoot: string;
  stateRoot: string;
  transactionsRoot: string;
  nBits: bigint;
  extensionHash: string;
  powSolutions: {
    pk: string;
    w: string;
    n: string;
    d: number;
  };
  height: number;
  parentId: string;
  votes: string;
}

abstract class AbstractNetwork {
  abstract getHeight: () => Promise<number>;

  abstract getAddressTransactionCount: (address: string) => Promise<number>;

  abstract getLastHeaders: (count: number) => Promise<Array<BlockHeader>>;

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

  setUrl: (url: string, networkType: NETWORK_BACKEND) => void;
  getNetwork: () => AbstractNetwork;
  getExplorerFront: () => string;
  fakeContext: () => wasm.ErgoStateContext;
}

export {
  ChainTypeInterface,
  BalanceInfo,
  AbstractNetwork,
  TokenInfo,
  NETWORK_BACKEND,
  EXPLORER_NETWORK,
  NODE_NETWORK,
  BlockHeader,
};
