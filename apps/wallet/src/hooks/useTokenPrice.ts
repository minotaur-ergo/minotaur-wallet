import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';
import { GlobalStateType, TokenValues } from '@minotaur-ergo/types';

import { setTokenValues } from '@/store/reducer/wallet';
import { PRICE_REFRESH_INTERVAL } from '@/utils/const';

const useTokenPrice = async () => {
  const dispatch = useDispatch();
  const wallets = useSelector((state: GlobalStateType) => state.wallet.wallets);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loading = useRef<boolean>(false);

  useEffect(() => {
    if (wallets.length === 0) return;
    const run = async () => {
      if (loading.current) return;
      try {
        loading.current = true;
        const tokenIds: string[] = [];
        const tokenValues: Array<TokenValues> = [];
        const fetchPush = async (id: string) => {
          const res = await CapacitorHttp.get({
            url: `https://api.cruxfinance.io/crux/token_info/${id}`,
          });
          tokenValues.push({
            id: id,
            valueInNanoErg: res.data.value_in_erg,
            decimal: res.data.decimals,
          });
        };
        wallets.forEach((w) => {
          w.tokens.forEach((t) => {
            if (tokenIds.indexOf(t.tokenId) === -1) {
              tokenIds.push(t.tokenId);
            }
          });
        });
        await Promise.all(tokenIds.map((id) => fetchPush(id)));
        dispatch(setTokenValues(tokenValues));
      } finally {
        loading.current = false;
      }
    };

    run();
    timerRef.current = setInterval(run, PRICE_REFRESH_INTERVAL);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [wallets, dispatch]);
};

export default useTokenPrice;
