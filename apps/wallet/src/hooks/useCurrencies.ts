import { CapacitorHttp } from '@capacitor/core';
import { SymbolType } from '@minotaur-ergo/types';

import { OptionsType } from '@/components/solitary/SolitarySelectField';

interface CurrencyInfo {
  symbol: string;
  direction: 'l' | 'r';
}

const currencyInfoMap: Record<string, CurrencyInfo> = {
  btc: { symbol: '₿', direction: 'l' },
  eth: { symbol: 'Ξ', direction: 'l' },
  ltc: { symbol: 'Ł', direction: 'l' },
  bch: { symbol: '₿', direction: 'l' },
  bnb: { symbol: 'BNB', direction: 'l' },
  eos: { symbol: 'EOS', direction: 'l' },
  xrp: { symbol: '✕', direction: 'l' },
  xlm: { symbol: '✧', direction: 'l' },
  link: { symbol: '🔗', direction: 'l' },
  dot: { symbol: '⚫', direction: 'l' },
  yfi: { symbol: 'YFI', direction: 'l' },
  sol: { symbol: '◎', direction: 'l' },

  usd: { symbol: '$', direction: 'l' },
  aed: { symbol: 'د.إ', direction: 'r' },
  ars: { symbol: '$', direction: 'l' },
  aud: { symbol: 'A$', direction: 'l' },
  bdt: { symbol: '৳', direction: 'r' },
  bhd: { symbol: '.د.ب', direction: 'r' },
  bmd: { symbol: '$', direction: 'l' },
  brl: { symbol: 'R$', direction: 'l' },
  cad: { symbol: 'C$', direction: 'l' },
  chf: { symbol: 'CHF', direction: 'l' },
  clp: { symbol: '$', direction: 'l' },
  cny: { symbol: '¥', direction: 'l' },
  czk: { symbol: 'Kč', direction: 'r' },
  dkk: { symbol: 'kr', direction: 'r' },
  eur: { symbol: '€', direction: 'l' },
  gbp: { symbol: '£', direction: 'l' },
  gel: { symbol: '₾', direction: 'l' },
  hkd: { symbol: 'HK$', direction: 'l' },
  huf: { symbol: 'Ft', direction: 'r' },
  idr: { symbol: 'Rp', direction: 'l' },
  ils: { symbol: '₪', direction: 'l' },
  inr: { symbol: '₹', direction: 'l' },
  jpy: { symbol: '¥', direction: 'l' },
  krw: { symbol: '₩', direction: 'l' },
  kwd: { symbol: 'د.ك', direction: 'r' },
  lkr: { symbol: 'Rs', direction: 'l' },
  mmk: { symbol: 'K', direction: 'r' },
  mxn: { symbol: '$', direction: 'l' },
  myr: { symbol: 'RM', direction: 'l' },
  ngn: { symbol: '₦', direction: 'l' },
  nok: { symbol: 'kr', direction: 'r' },
  nzd: { symbol: 'NZ$', direction: 'l' },
  php: { symbol: '₱', direction: 'l' },
  pkr: { symbol: 'Rs', direction: 'l' },
  pln: { symbol: 'zł', direction: 'r' },
  rub: { symbol: '₽', direction: 'l' },
  sar: { symbol: 'ر.س', direction: 'r' },
  sek: { symbol: 'kr', direction: 'r' },
  sgd: { symbol: 'S$', direction: 'l' },
  thb: { symbol: '฿', direction: 'l' },
  try: { symbol: '₺', direction: 'l' },
  twd: { symbol: 'NT$', direction: 'l' },
  uah: { symbol: '₴', direction: 'l' },
  vef: { symbol: 'Bs.', direction: 'l' },
  vnd: { symbol: '₫', direction: 'r' },
  zar: { symbol: 'R', direction: 'l' },

  xdr: { symbol: 'SDR', direction: 'l' },
  xag: { symbol: 'Ag', direction: 'l' },
  xau: { symbol: 'Au', direction: 'l' },
  bits: { symbol: 'μBTC', direction: 'l' },
  sats: { symbol: 'sat', direction: 'l' },
};

export function getCurrencySymbol(code: string): SymbolType {
  if (!code)
    return {
      symbol: '$',
      direction: 'l',
    };
  const currency: CurrencyInfo =
    currencyInfoMap[code.toLowerCase()] ?? code.toUpperCase();
  return {
    symbol: currency.symbol,
    direction: currency.direction,
  };
}

const getCurrencies = async (): Promise<OptionsType[]> => {
  const res = await CapacitorHttp.get({
    url: 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies',
  });
  return res.data.map((currency: string) => ({
    value: currency.toUpperCase(),
  }));
};

export default getCurrencies;
