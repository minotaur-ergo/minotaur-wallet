import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { MAIN_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

class MainnetChain implements ChainTypeInterface {
  readonly label = MAIN_NET_LABEL;
  readonly prefix = NetworkPrefix.Mainnet;
  static isUsingNode: boolean;
  static ergoExplorerNetwork: ErgoExplorerNetwork;
  static ergoNodeNetwork: ErgoNodeNetwork;

  init = (isUsingNode: boolean, explorerUrl: string, nodeUrl: string) => {
    MainnetChain.isUsingNode = isUsingNode;
    MainnetChain.ergoExplorerNetwork = new ErgoExplorerNetwork(explorerUrl);
    MainnetChain.ergoNodeNetwork = new ErgoNodeNetwork(explorerUrl, nodeUrl);
  };

  getNetwork = () => {
    return MainnetChain.isUsingNode
      ? MainnetChain.ergoNodeNetwork
      : MainnetChain.ergoExplorerNetwork;
  };

  getExplorerFront(): string {
    return 'https://explorer.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };
}

export { MainnetChain };
