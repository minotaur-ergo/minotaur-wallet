import { createContext } from 'react';

import { ReceiverType } from '@minotaur-ergo/types';

interface TxGenerateContextType {
  ready: boolean;
  total: bigint;
  tokens: { [tokenId: string]: bigint };
  receivers: Array<ReceiverType>;
  setReady: (ready: boolean) => unknown;
  selectedAddresses: Array<string> | 'all';
  setReceivers: (newReceivers: Array<ReceiverType>) => unknown;
  edit: (index: number, value: Partial<ReceiverType>) => unknown;
  setSelectedAddresses: (newAddresses: Array<string> | 'all') => unknown;
}

const TxGenerateContext = createContext<TxGenerateContextType>({
  ready: false,
  receivers: [],
  total: 0n,
  tokens: {},
  selectedAddresses: 'all',
  setReceivers: () => null,
  setSelectedAddresses: () => null,
  setReady: () => null,
  edit: () => null,
});

export default TxGenerateContext;
