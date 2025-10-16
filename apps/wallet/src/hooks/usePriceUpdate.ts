import { useEffect, useState } from 'react';
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

const usePriceUpdate = () => {
  const dispatch = useDispatch();
  const currency = useSelector((s: GlobalStateType) => s.config.currency);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currency) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const prevWeek = new Date(today.getTime() - 7 * 24 * 3600 * 1000);
        const [current, lastWeek] = await Promise.all([
          getCurrentPrice(currency),
          getPriceAtDate(prevWeek, currency),
        ]);
        dispatch(setPrice({ current, lastWeek }));
      } catch (err) {
        console.log(err);
      }
      timer = setTimeout(run, PRICE_REFRESH_INTERVAL);
    };

    run();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currency, dispatch]);

  return { loading };
};

export default usePriceUpdate;
