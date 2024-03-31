import {
  APIError,
  Box,
  DataSignError,
  Paginate,
  SignedInput,
  SignedTx,
  Tx,
  TxSendError,
  TxSignError,
} from '@/connector/types';
import {
  EventData,
  SignDataResponsePayload,
  SignTxInputResponsePayload,
  SignTxResponsePayload,
  SubmitTxResponsePayload,
} from './types';

declare global {
  interface Window {
    ergoConnector?: { [key: string]: unknown };
    ergo_request_read_access: (message_server_address?: string) => unknown;
    ergo_check_read_access: () => unknown;
    connect: (msg: unknown) => unknown;
    ergo?: MinotaurApi;
  }
}

class ExtensionConnector {
  private resolver: {
    currentId: number;
    requests: Map<
      string,
      {
        resolve: (value: unknown) => unknown;
        reject: (err?: unknown) => unknown;
      }
    >;
  } = {
    currentId: 1,
    requests: new Map(),
  };

  protected processEventType = '';

  protected constructor() {
    /* empty */
  }

  protected setup = () => {
    window.addEventListener('message', this.eventHandler);
  };

  protected rpcCall = (func: string, params?: unknown) => {
    return new Promise((resolve, reject) => {
      const msg = {
        type: this.processEventType,
        direction: 'request',
        requestId: `${this.resolver.currentId}`,
        function: func,
        payload: params,
      };
      console.log('new message to send: ', msg);
      window.postMessage(msg);
      this.resolver.requests.set(`${this.resolver.currentId}`, {
        resolve: resolve,
        reject: reject,
      });
      this.resolver.currentId++;
    });
  };

  private eventHandler = (event: MessageEvent<EventData>) => {
    if (
      event.data.type === this.processEventType &&
      event.data.direction === 'response'
    ) {
      const promise = this.resolver.requests.get(event.data.requestId);
      if (promise !== undefined) {
        this.resolver.requests.delete(event.data.requestId);
        const ret = event.data;
        if (ret.isSuccess) {
          this.processEvent(ret, promise.resolve);
        } else {
          promise.reject(ret);
        }
      }
    }
  };

  protected processEvent = (
    data: EventData,
    callback: (content: unknown) => unknown,
  ) => {
    callback(data);
  };
}

class MinotaurConnector extends ExtensionConnector {
  private static instance?: MinotaurConnector;
  protected processEventType = 'auth';

  private constructor() {
    super();
  }

  static getInstance = () => {
    if (MinotaurConnector.instance === undefined) {
      MinotaurConnector.instance = new MinotaurConnector();
      MinotaurConnector.instance.setup();
    }
    return MinotaurConnector.instance;
  };

  connect = (url?: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.rpcCall('connect', { server: url })
        .then(() => resolve(true))
        .catch(() => reject());
    });
  };

  is_connected = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.rpcCall('is_connected')
        .then((res) => resolve((res as EventData).payload as boolean))
        .catch(() => reject());
    });
  };

  protected processEvent = (
    data: EventData,
    callback: (content: unknown) => unknown,
  ) => {
    if (data.isSuccess) {
      window.ergo = MinotaurApi.getInstance();
      callback(data);
    }
  };
}

class MinotaurApi extends ExtensionConnector {
  private static instance?: MinotaurApi;
  protected processEventType = 'call';

  private constructor() {
    super();
  }

  static getInstance = () => {
    if (!MinotaurApi.instance) {
      MinotaurApi.instance = new MinotaurApi();
      MinotaurApi.instance.setup();
    }
    return MinotaurApi.instance;
  };

  get_used_addresses = (paginate?: Paginate) => {
    return new Promise<Array<string>>((resolve, reject) => {
      this.rpcCall('address', { type: 'used', page: paginate })
        .then((res) => {
          const data: EventData = res as EventData;
          resolve(data.payload as Array<string>);
        })
        .catch((err) => reject(err));
    });
  };

  get_unused_addresses = (paginate?: Paginate) => {
    return new Promise<Array<string>>((resolve, reject) => {
      this.rpcCall('address', { type: 'unused', page: paginate })
        .then((res) => {
          const data: EventData = res as EventData;
          resolve(data.payload as Array<string>);
        })
        .catch((err: unknown) => reject(err));
    });
  };

  get_change_address = () => {
    return new Promise<string>((resolve, reject) => {
      this.rpcCall('address', { type: 'change' })
        .then((res) => {
          const data: EventData = res as EventData;
          const addresses = data.payload as Array<string>;
          if (addresses.length > 0) {
            resolve(addresses[0]);
          } else {
            reject();
          }
        })
        .catch((err) => reject(err));
    });
  };

  get_balance = (
    token_id = 'ERG',
    ...token_ids: Array<string>
  ): Promise<bigint | { [id: string]: bigint }> => {
    return new Promise<bigint | { [id: string]: bigint }>((resolve, reject) => {
      this.rpcCall('balance', { tokens: [token_id, ...token_ids] })
        .then((res) => {
          const data = (res as EventData).payload as { [id: string]: string };
          const output: { [id: string]: bigint } = {};
          if (token_ids.length) {
            output[token_id] = BigInt(data[token_id]);
            token_ids.forEach((token) => {
              const tokenIdOrErg = token ? token : 'ERG';
              output[tokenIdOrErg] = BigInt(data[tokenIdOrErg]);
            });
            resolve(output);
          } else {
            resolve(BigInt(data[token_id ? token_id : 'ERG']));
          }
        })
        .catch(() => reject());
    });
  };

  get_utxos = (amount?: bigint, token_id = 'ERG', paginate?: Paginate) => {
    return new Promise<Array<Box> | undefined>((resolve, reject) => {
      this.rpcCall('boxes', {
        amount: amount,
        token_id: token_id,
        paginate: paginate,
      })
        .then((res) => {
          const data = (res as EventData).payload as Array<Box> | undefined;
          resolve(data);
        })
        .catch(() => reject());
    });
  };

  sign_tx = (tx: Tx) => {
    return new Promise<SignedTx | TxSignError>((resolve, reject) => {
      this.rpcCall('sign', {
        utx: tx,
      })
        .then((res) => {
          const data = (res as EventData).payload as SignTxResponsePayload;
          const response = data.error ? data.error : data.stx;
          resolve(response!);
        })
        .catch(() => reject());
    });
  };

  submit_tx = (tx: SignedTx) => {
    return new Promise<string | TxSendError>((resolve, reject) => {
      this.rpcCall('submit', {
        utx: tx,
      })
        .then((res) => {
          const data = (res as EventData).payload as SubmitTxResponsePayload;
          const response = data.error ? data.error : data.TxId;
          resolve(response!);
        })
        .catch(() => reject());
    });
  };

  sign_tx_input = (tx: Tx, index: number) => {
    return new Promise<SignedInput | APIError | TxSignError>(
      (resolve, reject) => {
        this.rpcCall('signTxInput', {
          tx: tx,
          index: index,
        })
          .then((res) => {
            const data = (res as EventData)
              .payload as SignTxInputResponsePayload;
            const response = data.error ? data.error : data.sInput;
            resolve(response!);
          })
          .catch(() => reject());
      },
    );
  };

  sign_data = (addr: string, message: string) => {
    return new Promise<string | DataSignError>((resolve, reject) => {
      this.rpcCall('signData', {
        address: addr,
        message: message,
      })
        .then((res) => {
          const data = (res as EventData).payload as SignDataResponsePayload;
          const response = data.error ? data.error : data.sData;
          resolve(response!);
        })
        .catch(() => reject());
    });
  };
}

const setupErgo = () => {
  if (window.ergoConnector !== undefined) {
    window.ergoConnector = {
      ...window.ergoConnector,
      minotaur: Object.freeze(MinotaurConnector.getInstance()),
    };
  } else {
    window.ergoConnector = {
      minotaur: Object.freeze(MinotaurConnector.getInstance()),
    };
  }

  const warnDeprecated = function (func: string) {
    console.warn(
      "[Deprecated] In order to avoid conflicts with another wallets, this method will be disabled and replaced by '" +
        func +
        "' soon.",
    );
  };

  if (!window.ergo_request_read_access && !window.ergo_check_read_access) {
    window.ergo_request_read_access = function () {
      warnDeprecated('ergoConnector.minotaur.connect()');
      return MinotaurConnector.getInstance()
        .connect()
        .then(() => null);
    };
    window.ergo_check_read_access = function () {
      warnDeprecated('ergoConnector.minotaur.isConnected()');
      return MinotaurConnector.getInstance()
        .is_connected()
        .then(() => null);
    };
  }
};

setupErgo();

export {};
