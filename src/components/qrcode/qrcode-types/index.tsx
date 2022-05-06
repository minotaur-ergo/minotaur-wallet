import React from "react";
import { TxSignR, TxPublishR, ErgoPayR } from "./QrCodeScanResult";
import TransactionSignRequest from "./TransactionSignRequest";
import TransactionPublishRequest from "./TransactionPublishRequest";
import ErgoPayRequest from "./ErgoPayRequest";
import { JsonBI } from "../../../util/json";

interface DetectParam {
    page: number;
    total: number;
    payload: string;
}

const detect = (value: string, regex: RegExp) : DetectParam | null => {
    const match = value.match(regex);
    if(match){
        return {
            page: parseInt((match.groups && match.groups.page) ? match.groups.page : "1"),
            total: parseInt((match.groups && match.groups.total) ? match.groups.total : "1"),
            payload: (match.groups && match.groups.payload) ? match.groups.payload : "",
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

export default Types;