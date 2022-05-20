import { Payload } from "./payloads";

export type ActionType =
    "registered" |
    "confirm" |
    "boxes" |
    "balance" |
    "address" |
    "sign" |
    "submit";


export type MessageContent = {
    action: ActionType;
    pageId: string;
    payloadType: string;
    requestId: string;
    payload: Payload;
}

export type MessageData = {
    sender: string;  // sender id. for server messages empty
    content: string; // Encrypted message
}

export interface PostMessage {
    action: "send" | "register",
    user?: string;
    content?: string;
    id?: string;
}
