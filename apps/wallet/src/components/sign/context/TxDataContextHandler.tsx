import React, { useMemo } from 'react';

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
  const { tx, dataBoxes, wallet, boxes, reduced } = props;
  const value = useMemo(
    () => ({
      tx,
      dataBoxes,
      wallet,
      boxes,
      reduced,
      networkType: wallet.networkType,
    }),
    [tx, dataBoxes, wallet, boxes, reduced],
  );
  return (
    <TxDataContext.Provider value={value}>
      {props.children}
    </TxDataContext.Provider>
  );
};

export default TxDataContextHandler;
