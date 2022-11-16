import { ERG_FACTOR } from './const';
import * as wasm from 'ergo-lib-wasm-browser';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import bs58 from 'bs58';
const bip32 = BIP32Factory(ecc);

const sum_erg_and_nano_erg = (
  erg: number | null | undefined,
  nano_erg: number | null | undefined
) => {
  const erg_bigint = erg ? BigInt(erg) : BigInt(0);
  const nano_erg_bigint = nano_erg ? BigInt(nano_erg) : BigInt(0);
  return erg_bigint * ERG_FACTOR + nano_erg_bigint;
};

const bigint_to_erg_str = (ergBigInt: bigint) => {
  const erg = ergBigInt / ERG_FACTOR;
  const nano_erg = Number(ergBigInt - ERG_FACTOR * erg);
  return erg_nano_erg_to_str(BigInt(erg), BigInt(nano_erg), 0);
};

const erg_nano_erg_to_str = (
  erg: bigint,
  nano_erg: bigint,
  digits?: number,
  maxDigit?: number
) => {
  maxDigit = maxDigit !== undefined ? maxDigit : 9;
  if (!digits) digits = 3;
  if (digits > maxDigit) digits = maxDigit;
  let nano_erg_str = '' + nano_erg;
  while (nano_erg_str.length < maxDigit) nano_erg_str = '0' + nano_erg_str;
  while (
    nano_erg_str.length > digits &&
    nano_erg_str.substr(nano_erg_str.length - 1) === '0'
  )
    nano_erg_str = nano_erg_str.substr(0, nano_erg_str.length - 1);
  return nano_erg_str.length === 0 ? erg.toString() : `${erg}.${nano_erg_str}`;
};

const html_safe_gson = (txt: string) => {
  const HTML_SAFE_REPLACEMENT_CHARS = [
    { regex: /</g, replace: '\\u003c' },
    { regex: />/g, replace: '\\u003e' },
    { regex: /&/g, replace: '\\u0026' },
    { regex: /=/g, replace: '\\u003d' },
    { regex: /'/g, replace: '\\u0027' },
  ];
  HTML_SAFE_REPLACEMENT_CHARS.forEach((replace) => {
    txt = txt.replace(replace.regex, replace.replace);
  });
  return txt;
};

const is_valid_address = (address: string) => {
  try {
    wasm.Address.from_base58(address);
    return true;
  } catch (exp) {
    return false;
  }
};

const is_valid_extended_public_key_base58 = (extended_public_key: string) => {
  try {
    bip32.fromBase58(extended_public_key);
    return true;
  } catch (e) {
    return false;
  }
};

const get_extended_public_key_from_eip_0003 = (extended_public_key: string) => {
  try {
    const buffer = Buffer.from(extended_public_key, 'hex');
    if (buffer.length < 78) return undefined;
    const epk = bip32.fromPublicKey(buffer.slice(45, 78), buffer.slice(13, 45));
    epk.neutered();
    return epk.toBase58();
  } catch (e) {
    return undefined;
  }
};

const get_extended_public_key_base64_or_hex_to_base58 = (
  extended_public_key: string,
  encoding: 'base64' | 'hex' = 'base64'
) => {
  try {
    const seed = Buffer.from(extended_public_key, encoding);
    const extended_base58 = bs58.encode(seed);
    bip32.fromBase58(extended_base58);
    return extended_base58;
  } catch (e) {
    return undefined;
  }
};

const get_base58_extended_public_key = (extended_public_key: string) => {
  if (is_valid_extended_public_key_base58(extended_public_key))
    return extended_public_key;
  const fromBase64 = get_extended_public_key_base64_or_hex_to_base58(
    extended_public_key,
    'base64'
  );
  if (fromBase64) return fromBase64;
  const fromHex = get_extended_public_key_base64_or_hex_to_base58(
    extended_public_key,
    'hex'
  );
  if (fromHex) return fromHex;
  return get_extended_public_key_from_eip_0003(extended_public_key);
};

const int8_vlq = (value: number) => {
  const sign = value > 0 ? 0 : 1;
  value = (value << 1) + sign;
  return uint8_vlq(value);
};

const uint8_vlq = (value: number) => {
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
export {
  sum_erg_and_nano_erg,
  html_safe_gson,
  bigint_to_erg_str,
  erg_nano_erg_to_str,
  is_valid_address,
  get_base58_extended_public_key,
  int8_vlq,
  uint8_vlq,
  bip32,
};
