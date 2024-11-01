import * as wasm from 'ergo-lib-wasm-browser';
import { createContext } from 'react';

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
  setUseServer: (useServer: boolean) => unknown;
  useServer: boolean;
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
  useServer: false,
  setUseServer: () => null,
});

export default TxSignContext;

export { StatusEnum };
