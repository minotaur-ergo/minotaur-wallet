import { createContext } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';

const enum StatusEnum {
  WAITING,
  SIGNING,
  SENDING,
  SENT,
  ERROR,
}

interface TxSignContextType {
  password: string;
  status: StatusEnum;
  setPassword: (newPassword: string) => unknown;
  setTx: (
    tx: wasm.UnsignedTransaction | undefined,
    boxes: Array<wasm.ErgoBox>,
    dataBoxes?: Array<wasm.ErgoBox>,
  ) => unknown;
  setReducedTx: (tx: wasm.ReducedTransaction | undefined) => unknown;
  networkType: string;
  handle: () => unknown;
  signed: string;
}

const TxSignContext = createContext<TxSignContextType>({
  password: '',
  status: StatusEnum.WAITING,
  setPassword: () => null,
  setTx: () => null,
  setReducedTx: () => null,
  networkType: '',
  handle: () => null,
  signed: '',
});

export default TxSignContext;

export { StatusEnum };

export type { TxSignContextType };
