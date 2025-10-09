import { createEmptyArray } from './array';
import { commaSeparate } from './txt';

export const tokenStr = (
  amount: bigint,
  decimal: number,
  displayDecimal?: number,
) => {
  const amount_str =
    createEmptyArray(decimal, '0').join('') + amount.toString();
  const valuePart =
    amount_str.substring(0, amount_str.length - decimal).replace(/^0+/, '') ||
    '0';
  const decimalPart = amount_str.substring(amount_str.length - decimal);
  const decimalPartTrimmed =
    displayDecimal === undefined
      ? decimalPart.replace(/0+$/, '')
      : decimalPart.substring(0, Math.min(displayDecimal, decimal));
  return (
    valuePart + (decimalPartTrimmed.length > 0 ? '.' + decimalPartTrimmed : '')
  );
};

export const tokenPriceCurrency = (
  amount: bigint,
  decimals: number,
  token_price: number,
  minFractionDigits: number = 2,
  maxFractionDigits: number = 8,
) => {
  const denom: bigint = BigInt(10) ** BigInt(decimals);

  const calcAtScale = (scale: number): bigint => {
    const priceScaled = BigInt(Math.round(token_price * Math.pow(10, scale)));
    return (amount * priceScaled) / denom;
  };

  let scale: number = minFractionDigits;
  let totalScaled: bigint = calcAtScale(scale);

  if (totalScaled === 0n && amount !== 0n && token_price > 0) {
    while (scale < maxFractionDigits) {
      scale += 1;
      totalScaled = calcAtScale(scale);
      if (totalScaled !== 0n) break;
    }
  }

  const s: string = totalScaled.toString();
  const fracLen: number = scale;
  const padded: string = s.padStart(fracLen + 1, '0');
  const intPart: string = padded.slice(0, -fracLen);
  let fracPart: string = padded.slice(-fracLen);

  if (scale > minFractionDigits) {
    const trimmed: string = fracPart.replace(/0+$/g, '');
    if (trimmed.length >= minFractionDigits) {
      fracPart = trimmed;
    }
  }

  const intFormatted: string = commaSeparate(intPart || '0');
  return fracPart ? `${intFormatted}.${fracPart}` : intFormatted;
};

export const ergPriceCurrency = (amount: bigint, erg_price: number) =>
  tokenPriceCurrency(amount, 9, erg_price);

export const numberWithDecimalToBigInt = (amount: string, decimal = 9) => {
  if (amount === '') return 0n;
  const regex = new RegExp(`^\\d+(\\.\\d*)?$`);
  if (!regex.test(amount)) {
    throw Error('Invalid number in format');
  }
  const parts = [...amount.split('.'), '', ''].slice(0, 2);
  if (parts[1].length > decimal) throw Error('more than allowed decimals');
  let part1 = parts[1].slice(0, decimal);
  part1 = part1 + createEmptyArray(decimal - parts[1].length, '0').join('');
  return BigInt(parts[0] + part1);
};
