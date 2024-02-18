import { ChainTypeInterface } from './interfaces';
import { NetworkPrefix } from 'ergo-lib-wasm-browser';
import ExplorerNetwork from './explorer';
import { TEST_NET_LABEL } from '../const';

class TestnetChain implements ChainTypeInterface {
  readonly label = TEST_NET_LABEL;
  readonly prefix = NetworkPrefix.Testnet;

  getNetwork = () => {
    return new ExplorerNetwork('https://api-testnet.ergoplatform.com');
  };

  getExplorerFront(): string {
    return 'https://testnet.ergoplatform.com';
  }
}

export { TestnetChain };
