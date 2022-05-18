import { Payload } from "../types";

export const DEFAULT_SERVER = "ws://127.0.0.1:6486";

export interface Session {
    port?: chrome.runtime.Port;
    popupPort?: chrome.runtime.Port;
    walletId?: string;
    requestId: string;
    id: string;
    server: string;
    requests: Map<string, EventData>;
}

export interface UIMessage {
    id: string;
    requestId?: number;
    action?: "approve" | "reject";
    type: "register" | "approve" | "get_params";
}

interface UIResponseInfo {
    server: string;
    enc_key: string;
    id: string;
    favIcon?: string;
    origin?: string;
}

export interface UIResponse {
    type: "set_info" | "registered" | "close" | "set_display";
    info?: UIResponseInfo;
    display?: string;
}

export type ConnectRequest = {
    fn: "connect";
    host?: "";
}

export type RequestBody = ConnectRequest;

export type EventFunction = "connect" |
    "is_connected" |
    "balance" |
    "address" |
    "boxes" |
    "sign" ;

export type EventData = {
    type: "call" | "auth";
    function: EventFunction;
    sessionId: string;
    direction: "request" | "response";
    requestId: string;
    isSuccess: boolean;
    payload?: Payload;
}
