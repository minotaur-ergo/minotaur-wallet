import { getReduced } from '@/action/tx';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import { useContext, useEffect, useState } from 'react';

const useReducedTx = () => {
  const txDataContext = useContext(TxDataContext);
  const txSignContext = useContext(TxSignContext);
  const [txId, setTxId] = useState('');
  const [networkType, setNetworkType] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (txDataContext.tx) {
      const tx = txDataContext.tx;
      if (
        txId !== tx.id().to_str() ||
        networkType !== txDataContext.networkType
      ) {
        setLoading(true);
        if (
          (txDataContext.reduced !== undefined &&
            txDataContext.reduced.unsigned_tx().id().to_str() ===
              tx.id().to_str()) ||
          txDataContext.networkType !== networkType
        ) {
          getReduced(
            txDataContext.networkType,
            txDataContext.tx,
            txDataContext.boxes,
            txDataContext.dataBoxes,
          ).then((reduced) => {
            txSignContext.setReducedTx(reduced);
            setNetworkType(txDataContext.networkType);
            setTxId(tx.id().to_str());
            setLoading(false);
          });
        }
      }
    }
  }, [
    txDataContext.tx,
    txDataContext.networkType,
    txDataContext.reduced,
    txDataContext.boxes,
    txDataContext.dataBoxes,
    txId,
    networkType,
    txSignContext,
  ]);
  return loading == false && txId !== txDataContext.tx?.id().to_str();
};

export default useReducedTx;
