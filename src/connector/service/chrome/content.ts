import { Paginate } from "@/connector/types";

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
    // window.addEventListener('message', this.eventHandler);
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

  // private eventHandler = (event: MessageEvent<EventData>) => {
  //   if (
  //     event.data.type === this.processEventType &&
  //     event.data.direction === 'response'
  //   ) {
  //     const promise = this.resolver.requests.get(event.data.requestId);
  //     if (promise !== undefined) {
  //       this.resolver.requests.delete(event.data.requestId);
  //       const ret = event.data;
  //       if (ret.isSuccess) {
  //         this.processEvent(ret, promise.resolve);
  //       } else {
  //         promise.reject(ret);
  //       }
  //     }
  //   }
  // };

  // protected processEvent = (
  //   data: EventData,
  //   callback: (content: any) => any
  // ) => {
  //   callback(data);
  // };
}

class MinotaurConnector extends ExtensionConnector {
  private static instance: MinotaurConnector;

  private constructor() {
    super();
  }

  static getInstance = () => {
    if (this.instance === undefined) {
      this.instance = new MinotaurConnector();
    }
    return this.instance;
  };
}

class MinotaurApi extends ExtensionConnector {
  private static instance?: MinotaurApi;

  private constructor () {
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
  }

  get_unused_addresses = (paginate?: Paginate) => {
  }

  get_change_address = () => {
  }

  get_balance = (
    token_id = 'ERG',
    ...token_ids: Array<string>
  ): Promise<bigint | { [id: string]: bigint }> => {
  }

  get_utxos = (amount?: bigint, token_id = 'ERG', paginate?: Paginate) => {
  }

  sign_tx = (tx: Tx) => {
  }

  submit_tx = (tx: SignedTx) => {
  }

  sign_tx_input = (tx: Tx, index: number) => {
  }

  sign_data = (addr: string, message: string) => {
  }
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
      // return MinotaurConnector.getInstance()
      //   .connect()
      //   .then((res) => null);
    };
    window.ergo_check_read_access = function () {
      warnDeprecated('ergoConnector.minotaur.isConnected()');
      // return MinotaurConnector.getInstance()
      //   .is_connected()
      //   .then((res) => null);
    };
  }
};

setupErgo();

export {};
