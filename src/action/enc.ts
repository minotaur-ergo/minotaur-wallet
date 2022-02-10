import * as crypto from "crypto";
import * as blakejs from "blakejs";
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

const getPassword = (password: string): Buffer => {
    return Buffer.from(blakejs.blake2b(password, undefined, 32));
};

const encrypt = (text: Buffer, password: string) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-cbc", getPassword(password), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (text: string, password: string) => {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift()!, "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", getPassword(password), iv);
    let decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]);
};

export {
    encrypt,
    decrypt
};
