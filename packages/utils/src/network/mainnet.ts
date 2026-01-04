import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { MAIN_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

class MainnetChain implements ChainTypeInterface {
  readonly label = MAIN_NET_LABEL;
  readonly prefix = NetworkPrefix.Mainnet;
  static ergoExplorerNetwork: ErgoExplorerNetwork;
  static ergoNodeNetwork: ErgoNodeNetwork;

  init = (explorerUrl: string, nodeUrl: string) => {
    MainnetChain.ergoExplorerNetwork = new ErgoExplorerNetwork(explorerUrl);
    MainnetChain.ergoNodeNetwork = new ErgoNodeNetwork(explorerUrl, nodeUrl);
  };

  getNetwork = () => {
    return MainnetChain.ergoExplorerNetwork;
  };

  getNodeNetwork = () => {
    return MainnetChain.ergoNodeNetwork;
  };

  getExplorerFront(): string {
    return 'https://explorer.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };
}

export { MainnetChain };
