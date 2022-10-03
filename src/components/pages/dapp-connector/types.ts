import * as uuid from 'uuid';

export type ActionType =
  | 'registered'
  | 'confirm'
  | 'confirmed'
  | 'boxes_request'
  | 'boxes_response'
  | 'balance_request'
  | 'balance_response'
  | 'address_request'
  | 'address_response'
  | 'sign_request'
  | 'sign_response'
  | 'submit_request'
  | 'submit_response';

export type Page = {
  page: number;
  limit: number;
};

export type ConfirmPayload = {
  id: string;
  display: string;
};

export type BoxRequestPayload = {
  amount: string;
  tokenId: string;
  page: Page;
};

export type BalanceRequestPayload = {
  tokens: Array<string>;
};

export type BalanceResponsePayload = { [tokenId: string]: string };

export type AddressRequestPayload = {
  type: 'used' | 'unused' | 'change' | 'all';
  page: Page;
};

export type AddressResponsePayload = Array<string>;

export type Payload =
  | ConfirmPayload
  | BoxRequestPayload
  | BalanceRequestPayload
  | BalanceResponsePayload
  | AddressRequestPayload
  | AddressResponsePayload;

export interface MessageContent {
  action: ActionType;
  requestId: string;
  payload?: Payload;
}

export interface MessageData {
  sender: string;
  pageId: string;
  content: string;
}

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

  constructor(
    server: string,
    error: (error: Event) => any,
    message: (message: MessageData) => any
  ) {
    this.id = uuid.v4();
    this.server = server;
    this.errorHandling = error;
    this.messageHandling = message;
  }

  handleMessage = (message: MessageEvent<string>) => {
    console.log(message.data);
    const data = JSON.parse(message.data) as MessageData;
    if (data.sender === '') {
      this.messageQueue.forEach((item) => this.connection?.send(item));
      this.messageQueue = [];
    } else {
      this.messageHandling(data);
    }
  };

  connect = () => {
    const connection = new WebSocket(this.server);
    connection.onopen = () => {
      connection.send(
        JSON.stringify({
          action: 'register',
          payload: { id: this.id },
        })
      );
    };
    connection.onclose = () => {
      this.connection = undefined;
    };
    connection.onmessage = this.handleMessage;
    connection.onerror = this.errorHandling;
    this.connection = connection;
  };

  send = (id: string, pageId: string, msg: string) => {
    const sendMsg = JSON.stringify({
      action: 'send',
      payload: {
        client: id,
        pageId: pageId,
        content: msg,
      },
    });
    if (this.connection) {
      this.connection.send(sendMsg);
    } else {
      this.messageQueue.push(sendMsg);
      this.connect();
    }
  };

  getId = () => this.id;

  isConnected = () => !!this.connection;
}
