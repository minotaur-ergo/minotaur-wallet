import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';

import { setPrice } from '@/store/reducer/config';
import { PRICE_REFRESH_INTERVAL } from '@/utils/const';

const getCurrentPrice = async () => {
  const queryParams = {
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false',
  };
  const res = await CapacitorHttp.get({
    url: 'https://api.coingecko.com/api/v3/coins/ergo',
    params: queryParams,
  });
  const current_prices = res.data.market_data.current_price;
  return current_prices.usd;
};

const getPriceAtDate = async (date: Date) => {
  const queryParams = {
    localization: 'false',
    date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
  };
  const res = await CapacitorHttp.get({
    url: 'https://api.coingecko.com/api/v3/coins/ergo/history',
    params: queryParams,
  });
  const current_prices = res.data.market_data.current_price;
  return current_prices.usd;
};

const usePriceUpdate = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const refresh = () => {
    setTimeout(() => setLoading(false), PRICE_REFRESH_INTERVAL);
  };
  useEffect(() => {
    if (!loading) {
      const today = new Date();
      setLoading(true);
      getCurrentPrice()
        .then((current) => {
          const prevWeek = new Date(today.getTime() - 1000 * 3600 * 24 * 7);
          getPriceAtDate(prevWeek)
            .then((lastWeek) => {
              dispatch(setPrice({ current, lastWeek }));
              refresh();
            })
            .catch(refresh);
        })
        .catch(refresh);
    }
  }, [loading, dispatch]);
  return loading;
};

export default usePriceUpdate;
