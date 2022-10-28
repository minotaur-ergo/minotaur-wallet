import { EventData } from '../types';

declare global {
  interface Window {
    ergoConnector?: { [key: string]: any };
    ergo_request_read_access: (message_server_address?: string) => any;
    ergo_check_read_access: () => any;
    connect: (msg: any) => any;
    ergo?: MinotaurApi;
  }
}

type Paginate = {
  page: number;
  limit: number;
};
class ExtensionConnector {
  private resolver: {
    currentId: number;
    requests: Map<
      string,
      { resolve: (value: any) => any; reject: (err?: any) => any }
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

  protected rpcCall = (func: string, params?: any) => {
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
      console.log(event, promise);
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
    callback: (content: any) => any
  ) => {
    callback(data);
  };
}

class MinotaurConnector extends ExtensionConnector {
  private static instance?: MinotaurConnector;
  protected processEventType = 'auth';

  static getInstance = () => {
    if (!MinotaurConnector.instance) {
      MinotaurConnector.instance = new MinotaurConnector();
      MinotaurConnector.instance.setup();
    }
    return MinotaurConnector.instance;
  };

  connect = (url?: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.rpcCall('connect', { server: url })
        .then((res) => resolve(true))
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
    callback: (content: any) => any
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
        .catch((err: any) => reject(err));
    });
  };

  get_unused_addresses = (paginate?: Paginate) => {
    return new Promise<Array<string>>((resolve, reject) => {
      this.rpcCall('address', { type: 'unused', page: paginate })
        .then((res) => {
          const data: EventData = res as EventData;
          resolve(data.payload as Array<string>);
        })
        .catch((err: any) => reject(err));
    });
  };

  get_change_address = () => {
    return new Promise<string>((resolve, reject) => {
      this.rpcCall('address', { type: 'change' })
        .then((res) => {
          console.log('res is ', res);
          const data: EventData = res as EventData;
          const addresses = data.payload as Array<string>;
          if (addresses.length > 0) {
            resolve(addresses[0]);
          } else {
            reject();
          }
        })
        .catch((err: any) => reject(err));
    });
  };

  get_balance = (
    token_id: string,
    ...token_ids: Array<string>
  ): Promise<bigint | { [id: string]: bigint }> => {
    return new Promise<bigint | { [id: string]: bigint }>((resolve, reject) => {
      this.rpcCall('balance', { tokens: [token_id, ...token_ids] })
        .then((res) => {
          console.log(res);
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

  get_utxos = (
    amount?: bigint,
    token_id = 'ERG',
    page?: { offset: number; limit: number }
  ) => {
    return new Promise<bigint>((resolve, reject) => {
      this.rpcCall('get_boxes', {
        amount: amount,
        token_id: token_id,
        page: page,
      })
        .then((res) => {
          resolve(BigInt((res as EventData).payload as string));
        })
        .catch(() => reject());
    });
  };
}

//     sign_tx = (tx) => {
//         return this._rpcCall("signTx", [tx]);
//     }
//
//     sign_tx_input = (tx, index) => {
//         return this._rpcCall("signTxInput", [tx, index]);
//     }
//
//     sign_data = (addr, message) => {
//         return this._rpcCall("signData", [addr, message]);
//     }
//
//     submit_tx = (tx) => {
//         return this._rpcCall("submitTx", [tx]);
//     }
//
//     _rpcCall = (func: string, params?: any) => {
//         return new Promise((resolve, reject) => {
//             window.postMessage({
//                 type: "rpc/connector-request",
//                 requestId: this.resolver.currentId,
//                 function: func,
//                 params
//             });
//             this.resolver.requests.set(this.resolver.currentId, {resolve: resolve, reject: reject});
//             this.resolver.currentId++;
//         });
//     }
//
//     eventHandler = (event) => {
//         if (event.data.type === "rpc/connector-response") {
//             console.debug(JSON.stringify(event.data));
//             const promise = this.resolver.requests.get(event.data.requestId);
//             if (promise !== undefined) {
//                 this.resolver.requests.delete(event.data.requestId);
//                 const ret = event.data.return;
//                 if (ret.isSuccess) {
//                     promise.resolve(ret.data);
//                 } else {
//                     promise.reject(ret.data);
//                 }
//             }
//         }
//     };
//
// }

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
        "' soon."
    );
  };

  if (!window.ergo_request_read_access && !window.ergo_check_read_access) {
    window.ergo_request_read_access = function () {
      warnDeprecated('ergoConnector.minotaur.connect()');
      return MinotaurConnector.getInstance()
        .connect()
        .then((res) => null);
    };
    window.ergo_check_read_access = function () {
      warnDeprecated('ergoConnector.minotaur.isConnected()');
      return MinotaurConnector.getInstance()
        .is_connected()
        .then((res) => null);
    };
  }
};

export default setupErgo;
