import { createEmptyArray } from './array';
import { commaSeparate } from './txt';

const tokenStr = (amount: bigint, decimal: number, displayDecimal?: number) => {
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

const tokenPriceUsd = (
  amount: bigint,
  decimals: number,
  token_price: number,
) => {
  const erg_price_cent = BigInt(Math.floor(token_price * 100));
  const total_cent = (
    (amount * erg_price_cent) /
    BigInt('1' + '0'.repeat(decimals))
  ).toString();
  const total_cent_with_leading_zeros = '00' + total_cent;
  return (
    commaSeparate(total_cent.substring(0, total_cent.length - 2) || '0') +
    '.' +
    total_cent_with_leading_zeros.substring(
      total_cent_with_leading_zeros.length - 2,
    )
  );
};

const ergPriceUsd = (amount: bigint, erg_price: number) =>
  tokenPriceUsd(amount, 9, erg_price);

const numberWithDecimalToBigInt = (amount: string, decimal = 9) => {
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

export { tokenStr, tokenPriceUsd, ergPriceUsd, numberWithDecimalToBigInt };
