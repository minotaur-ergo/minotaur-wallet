import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  GlobalStateType,
  MultiSigData,
  StateWallet,
} from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { fetchMultiSigRows } from '@/action/multi-sig/store';

import LoadingPage from '../../loading-page/LoadingPage';
import { MultiSigContext } from './MultiSigContext';
import { TxDataContext } from './TxDataContext';

interface MultiSigContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
}

const MultiSigContextHandler = (props: MultiSigContextHandlerPropsType) => {
  const [tx, setTx] = useState<wasm.ReducedTransaction>();
  const [hints, setHints] = useState<MultiSigData>([[]]);
  const [rowId, setRowId] = useState(-1);
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [dataBoxes, setDataBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [updateTime, setUpdateTime] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [signed, setSigned] = useState<wasm.Transaction>();
  const { txId } = useParams();

  const lastUpdateTime = useSelector(
    (config: GlobalStateType) => config.config.multiSigLoadedTime,
  );

  const setSignedChanged = (newSigned: wasm.Transaction) => {
    if (
      signed === undefined ||
      signed.id().to_str() !== newSigned.id().to_str()
    ) {
      setSigned(newSigned);
    }
  };

  const storeData = (data: MultiSigData, update: number) => {
    setHints(data);
    setUpdateTime(update);
  };

  useEffect(() => {
    if (!loading && txId) {
      if (
        (tx && tx.unsigned_tx().id().to_str() !== txId) ||
        updateTime < lastUpdateTime
      ) {
        setLoading(true);
        fetchMultiSigRows(props.wallet, [txId]).then((rows) => {
          if (rows.length > 0) {
            const row = rows[0];
            setTx(row.tx);
            setBoxes(row.boxes);
            setDataBoxes(row.dataBoxes);
            setRowId(row.rowId);
            setUpdateTime(Date.now());
            setHints(row.hints);
          }
          setLoading(false);
        });
      }
    }
  }, [loading, tx, txId, props.wallet, updateTime, lastUpdateTime]);

  if (tx) {
    return (
      <MultiSigContext.Provider
        value={{
          hints,
          password,
          requiredSign: props.wallet.requiredSign,
          rowId,
          setHints: storeData,
          setPassword,
          signed,
          setSigned: setSignedChanged,
        }}
      >
        <TxDataContext.Provider
          value={{
            wallet: props.wallet,
            tx: tx.unsigned_tx(),
            reduced: tx,
            dataBoxes: dataBoxes,
            boxes: boxes,
            networkType: props.wallet.networkType,
          }}
        >
          {props.children}
        </TxDataContext.Provider>
      </MultiSigContext.Provider>
    );
  }
  return <LoadingPage title={'Loading'} description={'Please wait'} />;
};

export default MultiSigContextHandler;
