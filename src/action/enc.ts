import * as crypto from "crypto";

// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

const getPassword = (password: string) => {
    return password + Array(32 - password.length).fill("0").join("")
}

const encrypt = (text: Buffer, password: string) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(getPassword(password)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

const decrypt = (text: string, password: string) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift()!, 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(getPassword(password)), iv);
    let decrypted = decipher.update(encryptedText);
    return Buffer.concat([decrypted, decipher.final()]);
}

export {
    encrypt,
    decrypt
}
