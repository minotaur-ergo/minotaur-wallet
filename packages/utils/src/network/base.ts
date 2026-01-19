import { ErgoStateContext, NetworkPrefix } from '@minotaur-ergo/ergo-lib';
import {
  AbstractNetwork,
  ChainTypeInterface,
  NETWORK_BACKEND,
} from '@minotaur-ergo/types';

import { fakeContext } from './context';
import ErgoExplorerNetwork from './explorer';
import ErgoNodeNetwork from './node';

abstract class BaseChain implements ChainTypeInterface {
  protected network: AbstractNetwork | undefined;
  abstract readonly label: string;
  abstract readonly prefix: NetworkPrefix;

  setUrl = (url: string, networkType: NETWORK_BACKEND) => {
    if (this.network) {
      if (
        this.network instanceof ErgoExplorerNetwork &&
        networkType === NETWORK_BACKEND.EXPLORER
      ) {
        return;
      }
      if (
        this.network instanceof ErgoNodeNetwork &&
        networkType === NETWORK_BACKEND.NODE
      ) {
        return;
      }
    }
    this.network =
      networkType === NETWORK_BACKEND.NODE
        ? new ErgoNodeNetwork(url)
        : new ErgoExplorerNetwork(url);
  };

  fakeContext = (): ErgoStateContext => {
    return fakeContext();
  };

  abstract getExplorerFront(): string;

  getNetwork = () => {
    if (!this.network) throw new Error("Network doesn't exist");
    return this.network;
  };
}

export { BaseChain };
