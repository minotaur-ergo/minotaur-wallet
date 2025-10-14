import { SymbolType } from '@minotaur-ergo/types';

const currencyInfoMap: Record<string, SymbolType> = {
  btc: { symbol: '₿', direction: 'l' },
  eth: { symbol: 'Ξ', direction: 'l' },
  ltc: { symbol: 'Ł', direction: 'l' },
  bch: { symbol: 'BCH', direction: 'r' },
  bnb: { symbol: 'BNB', direction: 'l' },
  eos: { symbol: 'EOS', direction: 'l' },
  xrp: { symbol: '✕', direction: 'l' },
  xlm: { symbol: 'XLM', direction: 'r' },
  link: { symbol: 'LINK', direction: 'r' },
  dot: { symbol: 'DOT', direction: 'r' },
  yfi: { symbol: 'YFI', direction: 'r' },
  sol: { symbol: 'SOL', direction: 'r' },

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
  xag: { symbol: 'XAG', direction: 'r' },
  xau: { symbol: 'XAU', direction: 'r' },
  bits: { symbol: 'μBTC', direction: 'l' },
  sats: { symbol: 'sat', direction: 'l' },
};

export const getCurrencySymbol = (code: string): SymbolType => {
  if (!code)
    return {
      symbol: '$',
      direction: 'l',
    };
  return (
    currencyInfoMap[code.toLowerCase()] ?? {
      symbol: code.toUpperCase(),
      direction: 'r',
    }
  );
};
