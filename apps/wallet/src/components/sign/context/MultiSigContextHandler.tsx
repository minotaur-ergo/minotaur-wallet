import * as wasm from 'ergo-lib-wasm-browser';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMultiSigRows } from '@/action/multi-sig/store';
import { GlobalStateType } from '@/store';
import { StateWallet } from '@/store/reducer/wallet';
import LoadingPage from '../../loading-page/LoadingPage';
import { MultiSigContext } from './MultiSigContext';
import { TxDataContext } from './TxDataContext';
import { MultiSigData } from '@/types/multi-sig';

interface MultiSigContextHandlerPropsType {
  wallet: StateWallet;
  children: React.ReactNode;
}

const MultiSigContextHandler = (props: MultiSigContextHandlerPropsType) => {
  const [reduced, setReduced] = useState<wasm.ReducedTransaction>();
  const [unsigned, setUnsigned] = useState<wasm.UnsignedTransaction>();
  const [data, setData] = useState<MultiSigData>({
    hints: [[]],
    secrets: [[]],
    signed: [],
  });
  const [rowId, setRowId] = useState(-1);
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [dataBoxes, setDataBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [updateTime, setUpdateTime] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { txId } = useParams();

  const lastUpdateTime = useSelector(
    (config: GlobalStateType) => config.config.multiSigLoadedTime,
  );

  const storeData = (data: MultiSigData, update: number) => {
    setData(data);
    setUpdateTime(update);
  };

  useEffect(() => {
    if (!loading && txId) {
      if (
        (reduced && reduced.unsigned_tx().id().to_str() !== txId) ||
        updateTime < lastUpdateTime
      ) {
        setLoading(true);
        fetchMultiSigRows(props.wallet, [txId]).then((rows) => {
          if (rows.length > 0) {
            const row = rows[0];
            setReduced(row.tx);
            setUnsigned(row.tx.unsigned_tx());
            setBoxes(row.boxes);
            setDataBoxes(row.dataBoxes);
            setRowId(row.rowId);
            setUpdateTime(Date.now());
            setData({
              hints: row.hints,
              secrets: row.secrets,
              signed: row.signed,
            });
          }
          setLoading(false);
        });
      }
    }
  }, [loading, reduced, txId, props.wallet, updateTime, lastUpdateTime]);
  if (reduced) {
    return (
      <MultiSigContext.Provider
        value={{
          data: data,
          password,
          requiredSign: props.wallet.requiredSign,
          rowId,
          setData: storeData,
          setPassword,
        }}
      >
        <TxDataContext.Provider
          value={{
            wallet: props.wallet,
            tx: unsigned,
            reduced: reduced,
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
