import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { TEST_NET_LABEL } from '@minotaur-ergo/types';

import { BaseChain } from './base';
import { fakeContext } from './context';

class TestnetChain extends BaseChain {
  readonly label = TEST_NET_LABEL;
  readonly prefix = NetworkPrefix.Testnet;

  getExplorerFront(): string {
    return 'https://testnet.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };
}

export { TestnetChain };
