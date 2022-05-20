import * as CryptoJS from "crypto-js";
import { MessageContent } from "./types/communication";


export const encrypt = (msg: MessageContent, password: string) => {
    return CryptoJS.AES.encrypt(JSON.stringify(msg), password).toString();
};

export const decrypt = (content: string, password: string) => {
    const bytes = CryptoJS.AES.decrypt(content, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as MessageContent;
};
