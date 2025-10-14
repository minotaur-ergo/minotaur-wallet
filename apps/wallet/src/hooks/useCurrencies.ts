import { CapacitorHttp } from '@capacitor/core';

import { OptionsType } from '@/components/solitary/SolitarySelectField';

const getCurrencies = async (): Promise<OptionsType[]> => {
  const res = await CapacitorHttp.get({
    url: 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies',
  });
  return res.data.map((currency: string) => ({
    value: currency.toUpperCase(),
  }));
};

export default getCurrencies;
