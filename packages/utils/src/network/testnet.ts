import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { TEST_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ExplorerNetwork from './explorer';

class TestnetChain implements ChainTypeInterface {
  readonly label = TEST_NET_LABEL;
  readonly prefix = NetworkPrefix.Testnet;

  getNetwork = () => {
    return new ExplorerNetwork('https://api-testnet.ergoplatform.com');
  };

  getExplorerFront(): string {
    return 'https://testnet.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };
}

export { TestnetChain };
