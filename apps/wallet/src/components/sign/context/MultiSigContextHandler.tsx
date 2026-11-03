import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  GlobalStateType,
  MultiSigData,
  StateWallet,
} from '@minotaur-ergo/types';

import {
  fetchMultiSigHints,
  fetchMultiSigRows,
} from '@/action/multi-sig/store';

import LoadingPage from '../../loading-page/LoadingPage';
import { MultiSigContext } from './MultiSigContext';
import { MultiSigPasswordContext } from './MultiSigPasswordContext';
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
  // unsigned_tx() copies the whole transaction in wasm, so do it once per tx
  const unsignedTx = useMemo(() => tx?.unsigned_tx(), [tx]);

  const lastUpdateTime = useSelector(
    (config: GlobalStateType) => config.config.multiSigLoadedTime,
  );

  const setSignedChanged = useCallback((newSigned: wasm.Transaction) => {
    setSigned((current) =>
      current !== undefined && current.id().to_str() === newSigned.id().to_str()
        ? current
        : newSigned,
    );
  }, []);

  const storeData = useCallback((data: MultiSigData, update: number) => {
    setHints(data);
    setUpdateTime(update);
  }, []);

  // memoized so consumers do not rerun their effects on unrelated renders
  const requiredSign = props.wallet.requiredSign;
  const multiSigValue = useMemo(
    () => ({
      hints,
      requiredSign,
      rowId,
      setHints: storeData,
      signed,
      setSigned: setSignedChanged,
    }),
    [hints, requiredSign, rowId, storeData, signed, setSignedChanged],
  );
  const passwordValue = useMemo(() => ({ password, setPassword }), [password]);
  const txDataValue = useMemo(
    () => ({
      wallet: props.wallet,
      tx: unsignedTx,
      reduced: tx,
      dataBoxes,
      boxes,
      networkType: props.wallet.networkType,
    }),
    [props.wallet, unsignedTx, tx, dataBoxes, boxes],
  );

  useEffect(() => {
    if (!loading && txId) {
      if (
        (unsignedTx && unsignedTx.id().to_str() !== txId) ||
        updateTime < lastUpdateTime
      ) {
        setLoading(true);
        if (unsignedTx && unsignedTx.id().to_str() === txId && rowId !== -1) {
          // same transaction: only hints change, so keep the loaded tx and boxes
          fetchMultiSigHints(props.wallet, rowId, boxes.length).then(
            (newHints) => {
              if (newHints) {
                setUpdateTime(Date.now());
                setHints(newHints);
              }
              setLoading(false);
            },
          );
        } else {
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
    }
  }, [
    loading,
    unsignedTx,
    txId,
    rowId,
    boxes.length,
    props.wallet,
    updateTime,
    lastUpdateTime,
  ]);

  if (tx) {
    return (
      <MultiSigContext.Provider value={multiSigValue}>
        <MultiSigPasswordContext.Provider value={passwordValue}>
          <TxDataContext.Provider value={txDataValue}>
            {props.children}
          </TxDataContext.Provider>
        </MultiSigPasswordContext.Provider>
      </MultiSigContext.Provider>
    );
  }
  return <LoadingPage title={'Loading'} description={'Please wait'} />;
};

export default MultiSigContextHandler;
