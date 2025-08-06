import React from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';

import { TxDataContext } from './TxDataContext';

interface TxDataContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
  tx?: wasm.UnsignedTransaction;
  reduced?: wasm.ReducedTransaction;
  boxes: Array<wasm.ErgoBox>;
  dataBoxes: Array<wasm.ErgoBox>;
}

const TxDataContextHandler = (props: TxDataContextHandlerPropsType) => {
  return (
    <TxDataContext.Provider
      value={{
        tx: props.tx,
        dataBoxes: props.dataBoxes,
        wallet: props.wallet,
        boxes: props.boxes,
        reduced: props.reduced,
        networkType: props.wallet.networkType,
      }}
    >
      {props.children}
    </TxDataContext.Provider>
  );
};

export default TxDataContextHandler;
