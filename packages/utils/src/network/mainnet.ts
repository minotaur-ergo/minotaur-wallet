import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { MAIN_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

class MainnetChain implements ChainTypeInterface {
  readonly label = MAIN_NET_LABEL;
  readonly prefix = NetworkPrefix.Mainnet;
  static syncWithNode: boolean;
  static submitTxWithNode: boolean;
  static ergoExplorerNetwork: ErgoExplorerNetwork;
  static ergoNodeNetwork: ErgoNodeNetwork;

  init = (syncWithNode: boolean, explorerUrl: string, nodeUrl: string) => {
    MainnetChain.syncWithNode = syncWithNode;
    MainnetChain.ergoExplorerNetwork = new ErgoExplorerNetwork(explorerUrl);
    MainnetChain.ergoNodeNetwork = new ErgoNodeNetwork(explorerUrl, nodeUrl);
  };

  getNetwork = () => {
    return MainnetChain.syncWithNode
      ? MainnetChain.ergoNodeNetwork
      : MainnetChain.ergoExplorerNetwork;
  };

  initTXSubmitNetwork = (
    submitTxWithNode: boolean,
    explorerUrl: string,
    nodeUrl: string,
  ) => {
    MainnetChain.submitTxWithNode = submitTxWithNode;
    MainnetChain.ergoExplorerNetwork = new ErgoExplorerNetwork(explorerUrl);
    MainnetChain.ergoNodeNetwork = new ErgoNodeNetwork(explorerUrl, nodeUrl);
  };

  getSubmitTxNetwork = () => {
    return MainnetChain.submitTxWithNode
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
