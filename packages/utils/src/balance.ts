import { BoxInfo, TokenValue } from '@minotaur-ergo/types';

import { toDay } from './date';
import { getBoxTokensValue, tokenPriceCurrency } from './token';
import { deserializeBox } from './wasm';

export const calculateDailyBalance = async (
  startDate: number,
  endDate: number,
  allTokenValues: Map<string, TokenValue>,
  groupedBox: Map<number, BoxInfo[]>,
  ergValues: Map<string, number> = new Map(),
) => {
  const MS = 1000;

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
    for (const box of walletBoxes) {
      const created = box.create.timestamp;
      const spent = box.spend ? box.spend.timestamp : null;
      const ergValue = deserializeBox(box.serialized).value().as_i64().as_num();
      const tokenValues = getBoxTokensValue(box, allTokenValues);
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
