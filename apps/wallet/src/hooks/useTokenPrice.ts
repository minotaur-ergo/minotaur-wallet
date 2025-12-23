import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';
import { GlobalStateType, TokenValue } from '@minotaur-ergo/types';

import { deserialize } from '@/action/box';
import { BoxDbAction } from '@/action/db';
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
        const tokenValues: Map<string, TokenValue> = new Map();
        const fetchAndStoreTokenValueInErg = async (id: string) => {
          const res = await CapacitorHttp.get({
            url: `https://api.cruxfinance.io/crux/token_info/${id}`,
          });
          tokenValues.set(id, {
            valueInErg: res.data.value_in_erg,
            decimal: res.data.decimals,
          });
        };
        await BoxDbAction.getInstance()
          .getBoxes()
          .then((boxes) => {
            for (const b of boxes) {
              const tokens = deserialize(b.serialized).tokens();
              for (let i = 0; i < tokens.len(); i++) {
                const tId = tokens.get(i).id().to_str();
                if (tokenIds.indexOf(tId) === -1) {
                  tokenIds.push(tId);
                }
              }
            }
          });
        await Promise.all(
          tokenIds.map((id) => fetchAndStoreTokenValueInErg(id)),
        );
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
