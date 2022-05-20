import * as uuid from "uuid";
import { MessageContent, MessageData, PostMessage } from "../../../connector/types/communication";
import { encrypt } from "../../../connector/utils";

export interface ConnectionData {
    server: string;
    id: string;
    requestId: string;
    enc_key: string;
    origin?: string;
    favIcon?: string;
    pageId: string;
}

export interface ConnectionState {
    info: ConnectionData;
    walletId?: number;
    actions: Array<any>;
    display: string;
}


export class Connection {
    private connection?: WebSocket;
    private readonly id: string;
    private readonly server: string;
    private readonly errorHandling: (error: Event) => any;
    private readonly messageHandling: (message: MessageData) => any;
    private messageQueue: Array<string> = [];

    constructor(server: string, error: (error: Event) => any, message: (message: MessageData) => any) {
        this.id = uuid.v4();
        this.server = server;
        this.errorHandling = error;
        this.messageHandling = message;
    }

    handleMessage = (message: MessageEvent<string>) => {
        console.log(message.data)
        const data = JSON.parse(message.data) as MessageData;
        if (data.sender === "") {
            this.messageQueue.forEach(item => this.connection?.send(item))
            this.messageQueue = [];
        } else {
            this.messageHandling(data)
        }
    }

    connect = () => {
        const connection = new WebSocket(this.server);
        connection.onopen = () => {
            connection.send(JSON.stringify({
                action: "register",
                id: this.id
            }))
        }
        connection.onclose = () => {
            this.connection = undefined
        }
        connection.onmessage = this.handleMessage;
        connection.onerror = this.errorHandling;
        this.connection = connection;
    }

    send = (id: string, enc_key: string, body: MessageContent) => {
        const content = enc_key ? encrypt(body, enc_key) : JSON.stringify(body)
        const msg: PostMessage = {
            action: "send",
            user: id,
            content: content
        };
        const msgStr = JSON.stringify(msg);
        if (this.connection) {
            this.connection.send(msgStr);
        } else {
            this.messageQueue.push(msgStr)
            this.connect();
        }
    }

    getId = () => this.id;

    isConnected = () => !!this.connection
}