import { ChainTypeInterface } from '@minotaur-ergo/types';
import { ErgoStateContext, NetworkPrefix } from 'ergo-lib-wasm-browser';
import ExplorerNetwork from './explorer';
import { TEST_NET_LABEL } from '../const';
import fakeContext from './fakeContext';

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
