import React from "react";
import { TxSignR, TxPublishR, ErgoPayR } from "./QrCodeScanResult";
import TransactionSignRequest from "./TransactionSignRequest";
import TransactionPublishRequest from "./TransactionPublishRequest";
import ErgoPayRequest from "./ErgoPayRequest";
import { JsonBI } from "../../../config/json";

interface DetectParam {
    page: number;
    total: number;
    payload: string;
}

const detect = (value: string, regex: RegExp) : DetectParam | null => {
    const match = value.match(regex);
    if(match){
        return {
            page: parseInt(match.groups?.page!),
            payload: match.groups?.payload!,
            total: parseInt(match.groups?.total!)
        }
    }
    return null
}

const Types = [
    {
        render: (param: string, close: () => any, completed?: (result: string) => any) => <TransactionSignRequest completed={completed}  tx={JsonBI.parse(param)} closeQrcode={close}/>,
        type: TxSignR,
        detect: (value: string) : DetectParam | null => detect(value, new RegExp(/^CSR(\/(?<page>[0-9]+)\/(?<total>[0-9]+))?(-)(?<payload>.*)$/))
    }, {
        render: (param: string, close: () => any, completed?: (result: string) => any) => <TransactionPublishRequest completed={completed} closeQrcode={close} tx={JsonBI.parse(param)}/>,
        type: TxPublishR,
        detect: (value: string) : DetectParam | null => detect(value, new RegExp(/^CSTX(\/(?<page>[0-9]+)\/(?<total>[0-9]+))?(-)(?<payload>.*)$/))
    }, {
        render: (param: string, close: () => any, completed?: (result: string) => any) => <ErgoPayRequest completed={completed} closeQrcode={close} url={param}/>,
        type: ErgoPayR,
        detect: (value: string) : DetectParam | null => {
            return value.startsWith("ergopay://") ? {page: 1, total: 1, payload: value.replace("ergopay://", "")} : null
        }
    }
];

export interface QrCodeContextType {
    qrCode: boolean;
    showQrCode: React.Dispatch<boolean>;
    value: string;
    cleanValue: () => any;
}
export default Types;