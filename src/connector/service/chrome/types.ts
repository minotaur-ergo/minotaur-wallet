import {
  APIError,
  Box,
  DataSignError,
  SignedInput,
  SignedTx,
  Tx,
  TxSendError,
  TxSignError,
} from '@/connector/types';

export const DEFAULT_SERVER = 'ws://127.0.0.1:6486';

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
  | 'signData'
  | 'signTxInput'
  | '';
export type EventData = {
  type: string;
  function: EventFunction;
  sessionId: string;
  direction: 'request' | 'response';
  requestId: string;
  isSuccess: boolean;
  payload?: unknown;
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
