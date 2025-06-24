import { ChainTypeInterface } from '@minotaur-ergo/types';

import { MainnetChain } from './mainnet';
import { TestnetChain } from './testnet';

const availableNetworks: Array<ChainTypeInterface> = [
  new TestnetChain(),
  new MainnetChain(),
];
const getChain = (networkType: string) => {
  const filtered = availableNetworks.filter(
    (item) => item.label === networkType,
  );
  if (filtered.length > 0) {
    return filtered[0];
  }
  return availableNetworks[0];
};

export default getChain;
