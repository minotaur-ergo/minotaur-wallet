import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { MAIN_NET_LABEL } from '@minotaur-ergo/types';

import { BaseChain } from './base';
import { fakeContext } from './context';

class MainnetChain extends BaseChain {
  readonly label = MAIN_NET_LABEL;
  readonly prefix = NetworkPrefix.Mainnet;

  getExplorerFront(): string {
    return 'https://explorer.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };
}

export { MainnetChain };
