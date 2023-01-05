import * as crypto from 'crypto';
import * as blake_js from 'blakejs';
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

const getPassword = (password: string): Buffer => {
  return Buffer.from(blake_js.blake2b(password, undefined, 32));
};

const encrypt = (text: Buffer, password: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    getPassword(password),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text: string, password: string) => {
  const textParts = text.split(':');
  const shifted = textParts.shift();
  if (shifted) {
    const iv = Buffer.from(shifted, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      getPassword(password),
      iv
    );
    const decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]);
  }
  return Buffer.from('', 'hex');
};

export { encrypt, decrypt };
