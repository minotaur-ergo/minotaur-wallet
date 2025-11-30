import { BIP32Factory } from 'bip32';
import base58 from 'bs58';
import * as ecc from 'tiny-secp256k1';

const bip32 = BIP32Factory(ecc);

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

export {
  bip32,
  isValidExtendedPublicKeyBase58,
  getExtendedPublicKeyFromEip0003,
  getExtendedPublicKeyBase64OrHexToBase58,
  getBase58ExtendedPublicKey,
};
