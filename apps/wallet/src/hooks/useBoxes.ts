import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { StateWallet } from '@minotaur-ergo/types';
import * as wasm from 'ergo-lib-wasm-browser';

import { GlobalStateType } from '@/store';
import { fetchBoxesFromNetwork, getInternalBoxes } from '@/utils/ergopay';
import { createEmptyArrayWithIndex } from '@/utils/functions';

const useBoxes = (
  tx: wasm.Transaction | wasm.UnsignedTransaction | undefined,
  wallet: StateWallet | undefined,
) => {
  const [boxes, setBoxes] = useState<Array<wasm.ErgoBox>>([]);
  const [loading, setLoading] = useState(false);
  const [loadedBoxIds, setLoadedBoxIds] = useState('');
  const [error, setError] = useState('');
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const [allowedWallets, setAllowedWallets] = useState<Array<StateWallet>>([]);
  const getBoxIds = () => {
    if (tx) {
      const inputs = tx.inputs();
      return createEmptyArrayWithIndex(inputs.len()).map((index) =>
        inputs.get(index).box_id().to_str(),
      );
    }
    return [];
  };
  const boxIds = getBoxIds();
  useEffect(() => {
    if (!loading && tx) {
      const newBoxIds = JSON.stringify(boxIds.sort());
      if (loadedBoxIds !== newBoxIds) {
        setLoading(true);
        getInternalBoxes(boxIds).then((boxes) => {
          if (
            Object.keys(boxes).length === 0 ||
            (wallet &&
              !Object.prototype.hasOwnProperty.call(boxes, `${wallet.id}`))
          ) {
            setError('This transaction does not belong to this wallet');
          } else if (wallet || Object.keys(boxes).length === 1) {
            const walletId = wallet ? `${wallet.id}` : Object.keys(boxes)[0];
            const foundedWallet = wallets.filter(
              (item) => `${item.id}` === walletId,
            );
            if (foundedWallet.length === 0) {
              setError('Internal error. wallet not found');
              setLoadedBoxIds(newBoxIds);
              setLoading(false);
            } else {
              fetchBoxesFromNetwork(
                boxIds,
                boxes[walletId],
                foundedWallet[0],
              ).then((allBoxes) => {
                setAllowedWallets(foundedWallet);
                setBoxes(allBoxes);
                setLoadedBoxIds(newBoxIds);
                setLoading(false);
              });
            }
          } else {
            setAllowedWallets(
              wallets.filter((item) =>
                Object.keys(boxes).includes(`${item.id}`),
              ),
            );
          }
        });
      }
    }
  }, [loading, boxIds, loadedBoxIds, wallet, wallets, tx]);
  return {
    boxes,
    loading,
    error,
    wallets: allowedWallets,
  };
};

export default useBoxes;
