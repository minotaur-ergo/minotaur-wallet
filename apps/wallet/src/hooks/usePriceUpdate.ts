import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';
import { GlobalStateType } from '@minotaur-ergo/types';

import { setPrice } from '@/store/reducer/config';
import { PRICE_REFRESH_INTERVAL } from '@/utils/const';

const getCurrentPrice = async (currency: string) => {
  const res = await CapacitorHttp.get({
    url: `https://api.coingecko.com/api/v3/simple/price?vs_currencies=${currency.toLowerCase()}&ids=ergo`,
  });
  return res.data.ergo[currency.toLowerCase()];
};

const getPriceAtDate = async (date: Date, currency: string) => {
  const queryParams = {
    localization: 'false',
    date: `${date.toISOString().split('T')[0]}`,
  };
  const res = await CapacitorHttp.get({
    url: 'https://api.coingecko.com/api/v3/coins/ergo/history',
    params: queryParams,
  });
  const current_prices = res.data.market_data.current_price;
  return current_prices[currency.toLowerCase()] ?? current_prices.usd;
};

const fetchAndDispatch = async (
  currency: string,
  onResult: (cur: number, last: number) => void,
  refresh: () => void,
) => {
  try {
    const today = new Date();
    const prevWeek = new Date(today.getTime() - 7 * 24 * 3600 * 1000);

    const [current, lastWeek] = await Promise.all([
      getCurrentPrice(currency),
      getPriceAtDate(prevWeek, currency),
    ]);

    onResult(current, lastWeek);
  } catch (e) {
    refresh();
  }
};

const usePriceUpdate = () => {
  const dispatch = useDispatch();
  const currency = useSelector((s: GlobalStateType) => s.config.currency);

  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = () => {
    if (!currency) return;

    setLoading(true);
    fetchAndDispatch(
      currency,
      (current, lastWeek) => {
        dispatch(setPrice({ current, lastWeek }));
        setLoading(false);
      },
      refresh,
    );
  };

  useEffect(() => {
    if (!currency) return;

    setLoading(true);
    fetchAndDispatch(
      currency,
      (current, lastWeek) => {
        dispatch(setPrice({ current, lastWeek }));
        setLoading(false);
      },
      refresh,
    );
  }, [currency, dispatch]);

  useEffect(() => {
    if (!currency) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setLoading(true);
      fetchAndDispatch(
        currency,
        (current, lastWeek) => {
          dispatch(setPrice({ current, lastWeek }));
          setLoading(false);
        },
        refresh,
      );
    }, PRICE_REFRESH_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [currency, dispatch]);

  return { loading, refresh };
};

export default usePriceUpdate;
