import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { MAIN_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

class MainnetChain implements ChainTypeInterface {
  readonly label = MAIN_NET_LABEL;
  readonly prefix = NetworkPrefix.Mainnet;

  getNetwork = () => {
    return this.getCustomNetwork('https://api.ergoplatform.com');
  };

  getCustomNetwork = (explorerUrl: string) => {
    return new ErgoExplorerNetwork(explorerUrl);
  };

  getExplorerFront(): string {
    return 'https://explorer.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };

  getNodeNetwork = (explorer: string, node: string) => {
    return new ErgoNodeNetwork(explorer, node);
  };
}

export { MainnetChain };
