import { Payload } from "../types/payloads";

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
    requestId?: string;
    pageId?: string;
    id: string;
    favIcon?: string;
    origin?: string;
}

export type UIResponseType = "set_info" | "registered" | "close" | "set_display" | "set_error";

export interface UIResponse {
    type: UIResponseType;
    info?: UIResponseInfo;
    display?: string;
    error?: string
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
    "sign" |
    "sign_data" |
    "submit";

export type EventDataType = "call" | "auth" | "register";

export type EventData = {
    type: EventDataType;
    function: EventFunction;
    sessionId: string;
    direction: "request" | "response";
    requestId: string;
    isSuccess: boolean;
    payload?: Payload;
}
