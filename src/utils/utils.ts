import { ERG_FACTOR } from "../config/const";
import * as wasm from "ergo-lib-wasm-browser";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import isElectron from "is-electron";
import { fromBase58 } from "bip32";

const sum_erg_and_nano_erg = (erg: number | null | undefined, nano_erg: number | null | undefined) => {
    const erg_bigint = erg ? BigInt(erg) : BigInt(0);
    const nano_erg_bigint = nano_erg ? BigInt(nano_erg) : BigInt(0);
    return erg_bigint * ERG_FACTOR + nano_erg_bigint;
};

const bigint_to_erg_str = (ergBigInt: bigint) => {
    const erg = ergBigInt / ERG_FACTOR;
    const nano_erg = Number(ergBigInt - ERG_FACTOR * erg);
    return erg_nano_erg_to_str(BigInt(erg), BigInt(nano_erg), 0);
};

const erg_nano_erg_to_str = (erg: bigint, nano_erg: bigint, digits?: number, maxDigit?: number) => {
    maxDigit = maxDigit !== undefined ? maxDigit : 9;
    if (!digits) digits = 3;
    if (digits > maxDigit) digits = maxDigit;
    let nano_erg_str = "" + nano_erg;
    while (nano_erg_str.length < maxDigit) nano_erg_str = "0" + nano_erg_str;
    while (nano_erg_str.length > digits && nano_erg_str.substr(nano_erg_str.length - 1) === "0")
        nano_erg_str = nano_erg_str.substr(0, nano_erg_str.length - 1);
    return nano_erg_str.length === 0 ? erg.toString() : `${erg}.${nano_erg_str}`;
};

const html_safe_gson = (txt: string) => {
    const HTML_SAFE_REPLACEMENT_CHARS = [
        { regex: /</g, replace: "\\u003c" },
        { regex: />/g, replace: "\\u003e" },
        { regex: /&/g, replace: "\\u0026" },
        { regex: /=/g, replace: "\\u003d" },
        { regex: /'/g, replace: "\\u0027" }
    ];
    HTML_SAFE_REPLACEMENT_CHARS.forEach(replace => {
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

const is_valid_extended_public_key = (extended_public_key: string) => {
    try{
        fromBase58(extended_public_key);
        return true;
    }catch (e){
        return false;
    }
}

const show_notification = (msg: string, title?: string) => {
    if (Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios") {
        Toast.show({ text: msg, position: "bottom", duration: "long" }).then(() => null);
    } else if (isElectron()) {
        const { Notification } = require("electron");
        new Notification({ title: title ? title : "", body: msg }).show()
    } else {
        alert(msg);
        // (new ToastWeb()).show({ text: msg, position: "bottom", duration: "long" }).then(() => null);
    }
};
export {
    sum_erg_and_nano_erg,
    html_safe_gson,
    bigint_to_erg_str,
    erg_nano_erg_to_str,
    is_valid_address,
    is_valid_extended_public_key,
    show_notification
};
