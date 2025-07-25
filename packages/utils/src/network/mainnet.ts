import { ChainTypeInterface } from '@minotaur-ergo/types';
import { ErgoStateContext, NetworkPrefix } from 'ergo-lib-wasm-browser';

import { MAIN_NET_LABEL } from '../const';
import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';

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
}

export { MainnetChain };
