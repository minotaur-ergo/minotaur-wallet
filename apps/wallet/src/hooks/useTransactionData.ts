import { useEffect, useState } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';
import { getChain } from '@minotaur-ergo/utils';

const useTransactionData = (txId: string, wallet: StateWallet) => {
  const [loadedTx, setLoadedTx] = useState<string>('');
  const [loadedWalletId, setLoadedWalletId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tx, setTx] = useState<wasm.Transaction>();
  const [date, setDate] = useState('');
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);

  useEffect(() => {
    if (!loading) {
      const processingTxId = txId;
      if (loadedWalletId !== `${wallet.id}` || txId !== loadedTx) {
        setLoading(true);
        const chain = getChain(wallet.networkType);
        chain
          .getExplorerNetwork()
          .getTransaction(processingTxId)
          .then((tx) => {
            setLoadedTx(processingTxId);
            setLoadedWalletId(`${wallet.id}`);
            setTx(tx.tx);
            setDate(tx.date);
            setBoxes(tx.boxes);
            setLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setTimeout(() => setLoading(false), 1000);
            // setLoading(false)
          });
      }
    }
  }, [loadedTx, loadedWalletId, loading, txId, wallet.id, wallet.networkType]);
  return {
    tx,
    boxes,
    date,
    loading,
  };
};

export default useTransactionData;
