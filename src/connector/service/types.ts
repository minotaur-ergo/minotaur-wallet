import * as wasm from 'ergo-lib-wasm-browser';
import {
  TxSignError,
  TxSendError,
} from '../../components/pages/dapp-connector/types/errorTypes';
import { UnsignedGeneratedTx } from '../../util/interface';
const DEFAULT_SERVER = 'ws://127.0.0.1:6486';

// export class Session {
//     port?: chrome.runtime.Port;
//     popupPort?: chrome.runtime.Port;
//     walletId?: string;
//     requestId: string;
//     id: string;
//     server: string;
//     requests: Map<string, EventData>
//
//     constructor(msg: EventData, port?: chrome.runtime.Port) {
//         this.requestId = `${msg.requestId}`;
//         this.port = port;
//         this.id = msg.sessionId
//         this.server = msg.payload && msg.payload.hasOwnProperty('address') ? msg.payload.address as string : DEFAULT_SERVER;
//         this.requests = new Map<string, EventData>();
//     }
//
//     addRequest = (msg: EventData) => {
//         this.requests.set(`${msg.requestId}`, {...msg})
//     }
// }
export interface Session {
  port?: chrome.runtime.Port;
  popupPort?: chrome.runtime.Port;
  walletId?: string;
  requestId: string;
  id: string;
  server: string;
  requests: Map<string, EventData>;
}

export type WalletConnectorType = {
  id: string;
  walletId: string;
  walletShared: string;
  secret: string;
  shared: string;
  server: string;
};

export interface UIMessage {
  id: string;
  requestId?: number;
  action?: 'approve' | 'reject';
  type: 'register' | 'approve' | 'get_params';
}

interface UIResponseInfo {
  server: string;
  enc_key: string;
  id: string;
  favIcon?: string;
  origin?: string;
}

export interface UIResponse {
  type: 'set_info' | 'registered' | 'close' | 'set_display';
  info?: UIResponseInfo;
  display?: string;
}

export type ConnectRequest = {
  fn: 'connect';
  host?: '';
};

export type RequestBody = ConnectRequest;

export type EventFunction =
  | 'connect'
  | 'is_connected'
  | 'balance'
  | 'address'
  | 'boxes'
  | 'sign'
  | 'submit'
  | '';
export type EventData = {
  type: string;
  function: EventFunction;
  sessionId: string;
  direction: 'request' | 'response';
  requestId: string;
  isSuccess: boolean;
  payload?: any;
};

export interface WalletRegisterInfo {
  id: string;
  shared: string;
}

interface WalletRegisterComplete {
  done: boolean;
}

type WalletMessagePayloadType = WalletRegisterInfo | WalletRegisterComplete;

export interface WalletMessage {
  requestId: number;
  payload: WalletMessagePayloadType;
}

// ==================== server message format ==========================

type ActionType =
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

export type BoxResponsePayload = {
  boxes: Array<wasm.ErgoBox> | undefined;
};

export type BalanceRequestPayload = {
  tokenIds: Array<string>;
};

export type BalanceResponsePayload = {
  amount: string;
  extra: { [tokenId: string]: string };
};

export type AddressRequestPayload = {
  type: 'used' | 'unused' | 'change' | 'all';
  page: Page;
};

export type AddressResponsePayload = Array<string>;

export type SignTxRequestPayload = {
  utx: UnsignedGeneratedTx;
};

export type SignTxResponsePayload = {
  stx: wasm.Transaction | undefined;
  error: TxSignError | undefined;
};

export type SubmitTxRequestPayload = {
  tx: wasm.Transaction;
};

export type SubmitTxResponsePayload = {
  TxId: string | undefined;
  error: TxSendError | undefined;
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
  | SubmitTxResponsePayload;

export interface MessageContent {
  action: ActionType;
  requestId: string;
  payload: Payload;
}

export interface MessageData {
  sender: string;
  pageId: string;
  content: string;
}
