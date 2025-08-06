import { createContext } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';

interface TxDataContextType {
  reduced?: wasm.ReducedTransaction;
  tx?: wasm.UnsignedTransaction;
  boxes: Array<wasm.ErgoBox>;
  dataBoxes: Array<wasm.ErgoBox>;
  networkType: string;
  wallet: StateWallet;
}

const TxDataContext = createContext<TxDataContextType>({
  boxes: [],
  dataBoxes: [],
  networkType: '',
  wallet: {} as StateWallet,
});

export { TxDataContext };

export type { TxDataContextType };
