import { BoxContent } from '@minotaur-ergo/types';
import { BIP32Factory } from 'bip32';
import base58 from 'bs58';
import * as wasm from 'ergo-lib-wasm-browser';
import * as ecc from 'tiny-secp256k1';

import { getBoxTokens } from '@/action/tx';
import { commaSeparate } from '@/utils/convert';

import getChain from './networks';

const bip32 = BIP32Factory(ecc);

const boxesToContent = (
  networkType: string,
  boxes: Array<wasm.ErgoBox | wasm.ErgoBoxCandidate>,
): Array<BoxContent> => {
  const chain = getChain(networkType);
  const prefix = chain.prefix;
  return boxes.map((box) => ({
    tokens: getBoxTokens(box),
    amount: BigInt(box.value().as_i64().to_str()),
    address: wasm.Address.recreate_from_ergo_tree(box.ergo_tree()).to_base58(
      prefix,
    ),
  }));
};

const numberWithDecimalToBigInt = (amount: string, decimal = 9) => {
  if (amount === '') return 0n;
  const regex = new RegExp(`^\\d+(\\.\\d{0,${decimal}})?$`);
  if (!regex.test(amount)) {
    throw Error('Invalid number in format');
  }
  const parts = [...amount.split('.'), '', ''].slice(0, 2);
  if (parts[1].length > decimal) throw Error('more than allowed decimals');
  let part1 = parts[1].slice(0, decimal);
  part1 = part1 + createEmptyArray(decimal - parts[1].length, '0').join('');
  return BigInt(parts[0] + part1);
};

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

const ergPriceUsd = (amount: bigint, erg_price: number) => {
  const erg_price_cent = BigInt(Math.floor(erg_price * 100));
  const total_cent = ((amount * erg_price_cent) / BigInt(1e9)).toString();
  return (
    commaSeparate(total_cent.substring(0, total_cent.length - 2) || '0') +
    '.' +
    total_cent.substring(total_cent.length - 2)
  );
};

const isValidAddress = (address: string, network?: wasm.NetworkPrefix) => {
  try {
    const wasmAddress = wasm.Address.from_base58(address);
    if (network) {
      return wasmAddress.to_base58(network) === address;
    }
    return true;
  } catch (exp) {
    return false;
  }
};

const isValidExtendedPublicKeyBase58 = (extended_public_key: string) => {
  try {
    bip32.fromBase58(extended_public_key);
    return true;
  } catch (e) {
    return false;
  }
};

const getExtendedPublicKeyFromEip0003 = (extended_public_key: string) => {
  try {
    const buffer = Buffer.from(extended_public_key, 'hex');
    if (buffer.length < 78) return undefined;
    const epk = bip32.fromPublicKey(
      buffer.subarray(45, 78),
      buffer.subarray(13, 45),
    );
    epk.neutered();
    return epk.toBase58();
  } catch (e) {
    return undefined;
  }
};

const getExtendedPublicKeyBase64OrHexToBase58 = (
  extended_public_key: string,
  encoding: 'base64' | 'hex' = 'base64',
) => {
  try {
    const seed = Buffer.from(extended_public_key, encoding);
    const extended_base58 = base58.encode(seed);
    bip32.fromBase58(extended_base58);
    return extended_base58;
  } catch (e) {
    return undefined;
  }
};

const getBase58ExtendedPublicKey = (extended_public_key: string) => {
  if (isValidExtendedPublicKeyBase58(extended_public_key))
    return extended_public_key;
  const fromBase64 = getExtendedPublicKeyBase64OrHexToBase58(
    extended_public_key,
    'base64',
  );
  if (fromBase64) return fromBase64;
  const fromHex = getExtendedPublicKeyBase64OrHexToBase58(
    extended_public_key,
    'hex',
  );
  if (fromHex) return fromHex;
  return getExtendedPublicKeyFromEip0003(extended_public_key);
};

const int8Vlq = (value: number) => {
  const sign = value > 0 ? 0 : 1;
  value = (value << 1) + sign;
  return uInt8Vlq(value);
};

const uInt8Vlq = (value: number) => {
  const res = [];
  while (value > 0) {
    if ((value & ~0x7f) === 0) {
      res.push(value);
      break;
    } else {
      res.push((value & 0x7f) | 0x80);
      value = value >> 7;
    }
  }
  return Buffer.from(Uint8Array.from(res)).toString('hex');
};

const createEmptyArray = <T>(length: number, defaultValue: T): Array<T> => {
  const res: Array<T> = [];
  for (let index = 0; index < length; index++) {
    res.push(defaultValue);
  }
  return res;
};

const createEmptyArrayWithIndex = (length: number): Array<number> => {
  const res: Array<number> = [];
  for (let index = 0; index < length; index++) {
    res.push(index);
  }
  return res;
};

const iterateIndexes = (length: number) => {
  return {
    forEach: (callback: (index: number) => unknown) => {
      for (let index = 0; index < length; index++) {
        callback(index);
      }
    },
  };
};

const sliceToChunksString = (arr: string, chunkSize: number) => {
  const res: Array<string> = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

const dottedText = (text: string, paddingSize: number) => {
  const dotStart = text.substring(0, paddingSize);
  const dottedEnd = text.substring(text.length - paddingSize);
  const dotted =
    text.length > 2 * paddingSize ? dotStart + '...' + dottedEnd : text;
  return dotted;
};

const getValueColor = (value: bigint) =>
  value > 0 ? 'success.main' : 'error.main';

export {
  tokenStr,
  ergPriceUsd,
  isValidAddress,
  getBase58ExtendedPublicKey,
  int8Vlq,
  uInt8Vlq,
  createEmptyArray,
  createEmptyArrayWithIndex,
  iterateIndexes,
  numberWithDecimalToBigInt,
  boxesToContent,
  sliceToChunksString,
  dottedText,
  bip32,
  getValueColor,
};
