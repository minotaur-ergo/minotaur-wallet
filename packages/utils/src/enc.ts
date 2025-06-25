import * as crypto from 'crypto-js';

export const encrypt = (text: Buffer, password: string) => {
  const bytes = crypto.AES.encrypt(
    crypto.enc.Utf8.parse(text.toString('hex')),
    password,
  );
  return bytes.toString();
};

export const decrypt = (text: string, password: string) => {
  const decrypted = crypto.AES.decrypt(text, password);
  const hex = decrypted.toString(crypto.enc.Utf8);
  return Buffer.from(hex, 'hex');
};
