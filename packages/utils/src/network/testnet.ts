import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { TEST_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

class TestnetChain implements ChainTypeInterface {
  readonly label = TEST_NET_LABEL;
  readonly prefix = NetworkPrefix.Testnet;

  getNetwork = () => {
    return this.getCustomNetwork('https://api-testnet.ergoplatform.com');
  };

  getCustomNetwork = (explorerUrl: string) => {
    return new ExplorerNetwork(explorerUrl);
  };

  getExplorerFront(): string {
    return 'https://testnet.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };

  getNodeNetwork = (explorer: string, node: string) => {
    return new ErgoNodeNetwork(explorer, node);
  };
}

export { TestnetChain };
