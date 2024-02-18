import { NetworkPrefix } from 'ergo-lib-wasm-browser';
import { AbstractNetwork } from './abstract_network';

interface ChainTypeInterface {
  readonly prefix: NetworkPrefix;
  readonly label: string;

  getNetwork: () => AbstractNetwork;
  getExplorerFront: () => string;
}

interface BalanceInfo {
  nanoErgs: bigint;
  tokens: Array<{
    id: string;
    amount: bigint;
  }>;
}

export type { ChainTypeInterface, BalanceInfo };
