import { NetworkPrefix } from 'ergo-lib-wasm-browser';
import { AbstractNetwork } from './abstractNetwork';
import * as wasm from 'ergo-lib-wasm-browser';

interface ChainTypeInterface {
  readonly prefix: NetworkPrefix;
  readonly label: string;

  getNetwork: () => AbstractNetwork;
  getExplorerFront: () => string;
  fakeContext: () => wasm.ErgoStateContext;
}

interface BalanceInfo {
  nanoErgs: bigint;
  tokens: Array<{
    id: string;
    amount: bigint;
  }>;
}

export type { ChainTypeInterface, BalanceInfo };
