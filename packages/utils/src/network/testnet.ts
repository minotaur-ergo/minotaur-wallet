import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import { ChainTypeInterface } from '@minotaur-ergo/types';

import { TEST_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

class TestnetChain implements ChainTypeInterface {
  readonly label = TEST_NET_LABEL;
  readonly prefix = NetworkPrefix.Testnet;
  static isUsingNode: boolean;
  static ergoExplorerNetwork: ErgoExplorerNetwork;
  static ergoNodeNetwork: ErgoNodeNetwork;

  init = (isUsingNode: boolean, explorerUrl: string, nodeUrl: string) => {
    TestnetChain.isUsingNode = isUsingNode;
    TestnetChain.ergoExplorerNetwork = new ErgoExplorerNetwork(explorerUrl);
    TestnetChain.ergoNodeNetwork = new ErgoNodeNetwork(explorerUrl, nodeUrl);
  };

  getNetwork = () => {
    return TestnetChain.isUsingNode
      ? TestnetChain.ergoNodeNetwork
      : TestnetChain.ergoExplorerNetwork;
  };

  getExplorerFront(): string {
    return 'https://testnet.ergoplatform.com';
  }

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };
}

export { TestnetChain };
