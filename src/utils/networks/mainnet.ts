import { ChainTypeInterface } from './interfaces';
import { ErgoStateContext, NetworkPrefix } from 'ergo-lib-wasm-browser';
import ErgoExplorerNetwork from './explorer';
import { MAIN_NET_LABEL } from '../const';
import fakeContext from './fakeContext';

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
