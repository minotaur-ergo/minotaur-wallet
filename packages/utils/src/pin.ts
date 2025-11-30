import { blake2bHex } from 'blakejs';

const getPinHash = (pin: string) => {
  return blake2bHex(pin, undefined, 32);
};

const honeyPinType = (pinType: string) => `${pinType}[honey]`;

export { getPinHash, honeyPinType };
