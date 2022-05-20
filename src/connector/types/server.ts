import * as WebSocket from "websocket";

export interface Client {
    id: string;
    connection: WebSocket.connection,
}