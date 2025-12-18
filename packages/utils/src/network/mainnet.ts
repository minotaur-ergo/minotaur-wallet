import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { MAIN_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork, { ErgoNodeNetwork } from './explorer';

class MainnetChain implements ChainTypeInterface {
  readonly label = MAIN_NET_LABEL;
  readonly prefix = NetworkPrefix.Mainnet;

  getNetwork = () => {
    return new ErgoExplorerNetwork('https://api.ergoplatform.com');
  };

  getExplorerFront(): string {
    return 'https://explorer.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };

  getNodeNetwork = (node: string) => {
    return new ErgoNodeNetwork('https://api.ergoplatform.com', node);
  };
}

export { MainnetChain };
