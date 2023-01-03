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
