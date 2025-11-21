import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CapacitorHttp } from '@capacitor/core';
import { GlobalStateType, TokenValue } from '@minotaur-ergo/types';
import { tokenPriceCurrency } from '@minotaur-ergo/utils';

import { BoxDbAction } from '@/action/db';
import Box from '@/db/entities/Box';
import { setBalanceHistory } from '@/store/reducer/wallet';

import { deserialize } from '../action/box';

const calculateDailyBalance = async (
  tokenValues: Map<string, TokenValue>,
  currency: string,
  boxes: Box[],
) => {
  const MS = 1000;
  const today = new Date();
  const endDate = today.getTime();
  const startDate = new Date(endDate - 365 * 24 * 3600 * MS).getTime();

  const toDay = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  const getBoxTokensValue = (box: Box): number => {
    const tokens = deserialize(box.serialized).tokens();
    let sum: number = 0;
    for (let i = 0; i < tokens.len(); i++) {
      const t = tokens.get(i);
      const tv: TokenValue = tokenValues.get(t.id().to_str()) || {
        valueInErg: 0,
        decimal: 0,
      };
      const val =
        Math.round(tv.valueInErg * 10 ** 9) *
        Math.round(Number(t.amount().as_i64().as_num()) / 10 ** tv.decimal);
      sum += val;
    }
    return sum;
  };

  // erg value during last year
  const ergValues = new Map();
  await CapacitorHttp.get({
    url: `https://api.coingecko.com/api/v3/coins/ergo/market_chart/range?vs_currency=${currency.toLowerCase()}&from=${toDay(startDate)}&to=${toDay(endDate)}`,
  }).then((res) =>
    res.data.prices.map((p: number[]) => {
      ergValues.set(toDay(p[0]), p[1]);
    }),
  );

  // group boxes based on their wallet id
  const groupedBox = new Map<number, Box[]>();
  for (const b of boxes) {
    const wId = b.address?.wallet?.id || -1;
    if (wId === -1) {
      continue;
    }
    if (!groupedBox.has(wId)) {
      groupedBox.set(wId, []);
    }
    groupedBox.get(wId)?.push(b);
  }

  // wallet id => balances
  const data: Record<number, number[]> = {};
  for (const [walletId, walletBoxes] of groupedBox.entries()) {
    // balance changes
    const delta = new Map();
    const addDelta = (day: string, amount: number) => {
      delta.set(day, (delta.get(day) || 0) + amount);
    };

    // wallet balance before start date
    let startBalance = 0;
    for (const b of walletBoxes) {
      const created = b.create_timestamp;
      const spent = b.spend_timestamp ? b.spend_timestamp : null;
      const ergValue = deserialize(b.serialized).value().as_i64().as_num();
      const tokenValues = getBoxTokensValue(b);

      // it was in wallet before start date
      if (created < startDate && (!spent || spent >= startDate)) {
        startBalance += ergValue + tokenValues;
      }

      // it was added to wallet during start & end date
      if (created >= startDate && created <= endDate) {
        addDelta(toDay(created), ergValue + tokenValues);
      }

      // it has been spent during start & end date
      if (spent && spent >= startDate && spent <= endDate) {
        addDelta(toDay(spent), -ergValue - tokenValues);
      }
    }

    // current balane
    let running = startBalance;
    const balances = [];
    for (let day = startDate; day <= endDate; day += 24 * 3600 * MS) {
      if (delta.has(toDay(day))) {
        running += delta.get(toDay(day)) || 0;
      }
      const ergVal = ergValues.get(toDay(day)) || 0;
      balances.push(
        Number(
          tokenPriceCurrency(BigInt(running), 9, ergVal).replace(/,/g, ''),
        ),
      );
    }
    data[walletId] = balances;
  }

  return data;
};

const useBalanceChart = async () => {
  const dispatch = useDispatch();
  const loading = useRef<boolean>(false);
  const tokenValues = useSelector(
    (state: GlobalStateType) => state.wallet.tokenValues,
  );
  const currency = useSelector(
    (state: GlobalStateType) => state.config.currency,
  );

  const run = useCallback(async () => {
    if (loading.current || !currency) return;
    loading.current = true;
    calculateDailyBalance(
      tokenValues,
      currency,
      await BoxDbAction.getInstance().getBoxes(),
    )
      .then((data) => {
        dispatch(setBalanceHistory(data));
      })
      .finally(() => {
        loading.current = false;
      });
  }, [tokenValues, currency, dispatch]);

  useEffect(() => {
    run();
  }, [run]);
};

export default useBalanceChart;
