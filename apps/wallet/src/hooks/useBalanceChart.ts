import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';
import { BoxInfo, GlobalStateType } from '@minotaur-ergo/types';
import { calculateDailyBalance } from '@minotaur-ergo/utils/src/balance';
import { toDay } from '@minotaur-ergo/utils/src/date';

import { BoxDbAction } from '@/action/db';
import Box from '@/db/entities/Box';
import {
  setBalanceHistory,
  setLoadingBalanceHistory,
  setShowBalanceChart,
} from '@/store/reducer/wallet';

const useBalanceChart = () => {
  const dispatch = useDispatch();
  const tokenValues = useSelector(
    (state: GlobalStateType) => state.wallet.tokenValues,
  );
  const currency = useSelector(
    (state: GlobalStateType) => state.config.currency,
  );
  const isRunning = useRef<boolean>(false);
  const ergValues = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (isRunning.current || !currency) return;
    const run = async () => {
      if (isRunning.current) return;
      isRunning.current = true;
      dispatch(setLoadingBalanceHistory(true));
      const today = new Date();
      const endDate = today.getTime();
      const startDate = new Date(endDate - 365 * 24 * 3600 * 1000).getTime();
      // erg value during last year
      if (ergValues.current.size === 0) {
        try {
          await CapacitorHttp.get({
            url: `https://api.coingecko.com/api/v3/coins/ergo/market_chart/range?vs_currency=${currency.toLowerCase()}&from=${toDay(startDate)}&to=${toDay(endDate)}`,
          }).then((res) => {
            res.data.prices.map((price: number[]) => {
              ergValues.current.set(toDay(price[0]), price[1]);
            });
          });
        } catch (e) {
          console.log('Failed to fetch ergo price data');
          dispatch(setShowBalanceChart(false));
          isRunning.current = false;
          setTimeout(() => {
            run();
          }, 30000);
          return;
        }
      }

      const groupedBox = new Map<number, BoxInfo[]>();
      await BoxDbAction.getInstance()
        .getBoxes()
        .then((boxes: Box[]) => {
          for (const box of boxes) {
            const walletId = box.address?.wallet?.id || -1;
            if (walletId === -1) {
              continue;
            }
            if (!groupedBox.has(walletId)) {
              groupedBox.set(walletId, []);
            }
            const boxInfo: BoxInfo = {
              address: box.address?.address || '',
              boxId: box.box_id,
              create: {
                index: box.create_index,
                height: box.create_height,
                tx: box.tx_id.toString(),
                timestamp: box.create_timestamp,
              },
              ...(box.spend_tx_id && {
                spend: {
                  index: box.spend_index || -1,
                  height: box.spend_height || -1,
                  tx: box.spend_tx_id?.toString() || '',
                  timestamp: box.spend_timestamp || -1,
                },
              }),
              serialized: box.serialized,
            };
            groupedBox.get(walletId)?.push(boxInfo);
          }
        });
      calculateDailyBalance(
        startDate,
        endDate,
        tokenValues,
        groupedBox,
        ergValues.current,
      )
        .then((data: Record<number, number[]>) => {
          dispatch(setBalanceHistory(data));
        })
        .finally(() => {
          dispatch(setLoadingBalanceHistory(false));
          dispatch(setShowBalanceChart(true));
          isRunning.current = false;
        });
    };

    run();
  }, [currency, tokenValues, dispatch]);
};

export default useBalanceChart;
