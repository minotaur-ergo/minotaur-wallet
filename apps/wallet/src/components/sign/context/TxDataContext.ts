import { StateWallet } from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';
import { createContext } from 'react';

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
