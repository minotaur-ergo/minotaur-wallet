import { blake2bHex } from 'blakejs';

export const getPinHash = (pin: string) => {
  return blake2bHex(pin, undefined, 32);
};

export const honeyPinType = (pinType: string) => `${pinType}[honey]`;
