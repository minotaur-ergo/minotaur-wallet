import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';
import { toDay } from '@minotaur-ergo/utils/src/date';

import { setShowBalanceChart } from '@/store/reducer/wallet';

const useErgoPrice = (currency: string) => {
  const dispatch = useDispatch();
  const MS = 1000;
  const [ergValues, setErgValues] = useState<Map<string, number>>(new Map());
  const isRunning = useRef<boolean>(false);

  useEffect(() => {
    if (!currency) return;
    const run = async () => {
      if (isRunning.current) return;
      isRunning.current = true;
      try {
        const endDate = new Date().getTime();
        const startDate = new Date(endDate - 365 * 24 * 3600 * MS).getTime();
        await CapacitorHttp.get({
          url: `https://api.coingecko.com/api/v3/coins/ergo/market_chart/range?vs_currency=${currency.toLowerCase()}&from=${toDay(startDate)}&to=${toDay(endDate)}`,
        }).then((res) => {
          const newErgValues = new Map<string, number>();
          res.data.prices.map((price: number[]) => {
            newErgValues.set(toDay(price[0]), price[1]);
          });
          setErgValues(newErgValues);
        });
        dispatch(setShowBalanceChart(true));
      } catch (e) {
        dispatch(setShowBalanceChart(false));
        console.log('Failed to fetch ergo price data');
        setTimeout(() => {
          run();
        }, 60 * MS);
        return;
      } finally {
        isRunning.current = false;
      }
    };
    run();
  }, [currency, dispatch]);

  return ergValues;
};

export default useErgoPrice;
