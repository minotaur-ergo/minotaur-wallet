import { fetchMultiSigRows } from '@/action/multi-sig/store';
import { StateWallet } from '@/store/reducer/wallet';
import { MultiSigData } from '@/types/multi-sig';
import * as wasm from 'ergo-lib-wasm-browser';
import { useEffect, useState } from 'react';

const useMultiSigLocalRow = (
  txId: string,
  wallet: StateWallet,
  lastUpdateTime: number,
  extract: boolean,
) => {
  const [tx, setTx] = useState<wasm.ReducedTransaction>();
  const [data, setData] = useState<MultiSigData>({
    commitments: [[]],
    secrets: [[]],
    signed: [],
    simulated: [],
  });
  const [rowId, setRowId] = useState(-1);
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [dataBoxes, setDataBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [updateTime, setUpdateTime] = useState(-1);
  const [loading, setLoading] = useState(false);
  const storeData = (data: Partial<MultiSigData>, update: number) => {
    setData(oldData => ({...oldData, ...data}));
    setUpdateTime(update);
  };

  useEffect(() => {
    if (extract && !loading && txId) {
      if (
        (tx && tx.unsigned_tx().id().to_str() !== txId) ||
        updateTime < lastUpdateTime
      ) {
        setLoading(true);
        fetchMultiSigRows(wallet, [txId]).then((rows) => {
          if (rows.length > 0) {
            const row = rows[0];
            setTx(row.tx);
            setBoxes(row.boxes);
            setDataBoxes(row.dataBoxes);
            setRowId(row.rowId);
            setUpdateTime(Date.now());
            setData({
              commitments: row.commitments,
              secrets: row.secrets,
              signed: row.signed,
              simulated: row.simulated,
              partial: row.partial,
            });
          }
          setLoading(false);
        });
      }
    }
  }, [extract, loading, tx, txId, wallet, updateTime, lastUpdateTime]);
  return {
    tx,
    data,
    rowId,
    boxes,
    dataBoxes,
    loading,
    storeData,
    serverId: '',
  };
};

export default useMultiSigLocalRow;
