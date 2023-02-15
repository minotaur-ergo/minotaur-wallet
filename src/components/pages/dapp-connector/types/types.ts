import * as uuid from 'uuid';
import * as wasm from 'ergo-lib-wasm-browser';
import {
  APIError,
  DataSignError,
  TxSendError,
  TxSignError,
} from './errorTypes';
import { UnsignedGeneratedTx } from '../../../../util/interface';
import WalletWithErg from '../../../../db/entities/views/WalletWithErg';
import { Box, SignedInput, SignedTx, Tx } from './eipTypes';

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
  | 'submit_response'
  | 'sign_data_request'
  | 'sign_data_response'
  | 'sign_tx_input_request'
  | 'sign_tx_input_response';

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
export type BoxResponsePayload = {
  boxes: Array<Box> | undefined;
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

export type SignTxRequestPayload = {
  utx: Tx;
};

export type SignTxResponsePayload = {
  stx: SignedTx | undefined;
  error: TxSignError | undefined;
};

export type SubmitTxRequestPayload = {
  tx: SignedTx;
};

export type SubmitTxResponsePayload = {
  TxId: string | undefined;
  error: TxSendError | undefined;
};

export type SignDataRequestPayload = {
  address: string;
  message: string;
};

export type SignDataResponsePayload = {
  sData: string | undefined;
  error: DataSignError | undefined;
};

export type SignTxInputRequestPayload = {
  tx: Tx;
  index: number;
};

export type SignTxInputResponsePayload = {
  sInput: SignedInput | undefined;
  error: TxSignError | APIError | undefined;
};

export type Payload =
  | ConfirmPayload
  | BoxRequestPayload
  | BoxResponsePayload
  | BalanceRequestPayload
  | BalanceResponsePayload
  | AddressRequestPayload
  | AddressResponsePayload
  | SignTxRequestPayload
  | SignTxResponsePayload
  | SubmitTxRequestPayload
  | SubmitTxResponsePayload
  | SignDataRequestPayload
  | SignDataResponsePayload
  | SignTxInputRequestPayload
  | SignTxInputResponsePayload;
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

export interface modalDataProp {
  type: string;
  wallet: WalletWithErg | null;
  data: UnsignedGeneratedTx | undefined;
  onAccept: (password: string) => Promise<void>;
  onDecline: () => Promise<void>;
}

export class Connection {
  private connection?: WebSocket;
  private readonly id: string;
  private readonly server: string;
  private readonly errorHandling: (error: Event) => unknown;
  private readonly messageHandling: (message: MessageData) => unknown;
  private messageQueue: Array<string> = [];

  constructor(
    server: string,
    error: (error: Event) => unknown,
    message: (message: MessageData) => unknown
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
