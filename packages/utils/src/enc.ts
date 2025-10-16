import { AES, enc } from 'crypto-js';

const encrypt = (text: Buffer, password: string) => {
  const bytes = AES.encrypt(enc.Utf8.parse(text.toString('hex')), password);
  return bytes.toString();
};

const decrypt = (text: string, password: string) => {
  try {
    const decrypted = AES.decrypt(text, password);
    const hex = decrypted.toString(enc.Utf8);
    return Buffer.from(hex, 'hex');
  } catch (e) {
    return Buffer.from('', 'hex');
  }
};

export { encrypt, decrypt };
