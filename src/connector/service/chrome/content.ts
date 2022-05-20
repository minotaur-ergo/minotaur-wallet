import { EventData, EventDataType, EventFunction } from "../types";
import { Tx, SignedTx, Box, SignedInput } from "../../types/blockchain";
import { ConfirmResponsePayload, Payload, BoxResponsePayload, Paginate } from "../../types/payloads";
import { TxSignError, APIError, PaginateError } from "../../types/errors";

declare global {
    interface Window {
        ergoConnector?: { [key: string]: any };
        ergo_request_read_access: (message_server_address?: string) => any;
        ergo_check_read_access: () => any;
        connect: (msg: any) => any;
        ergo?: MinotaurApi;
    }
}

class ExtensionConnector {
    private resolver: { currentId: number, requests: Map<string, { resolve: (value: EventData) => any, reject: (err?: any) => any }> } = {
        currentId: 1,
        requests: new Map()
    };

    protected processEventType: EventDataType = "call";

    protected constructor() {
    }

    protected setup = () => {
        window.addEventListener("message", this.eventHandler);
    };

    protected rpcCall = (func: EventFunction, params?: Payload): Promise<EventData> => {
        return new Promise<EventData>((resolve, reject) => {
            const msg: EventData = {
                type: this.processEventType,
                direction: "request",
                requestId: `${this.resolver.currentId}`,
                function: func,
                isSuccess: false,
                sessionId: "",
                payload: params
            };
            window.postMessage(msg);
            this.resolver.requests.set(`${this.resolver.currentId}`, { resolve: resolve, reject: reject });
            this.resolver.currentId++;
        });
    };

    private eventHandler = (event: MessageEvent<EventData>) => {
        if (event.data.type === this.processEventType && event.data.direction === "response") {
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

    protected processEvent = (data: EventData, callback: (content: any) => any) => {
        callback(data);
    };
}

class MinotaurConnector extends ExtensionConnector {
    private static instance?: MinotaurConnector;
    protected processEventType: EventDataType = "auth";

    static getInstance = () => {
        if (!MinotaurConnector.instance) {
            MinotaurConnector.instance = new MinotaurConnector();
            MinotaurConnector.instance.setup();
        }
        return MinotaurConnector.instance;
    };

    connect = (url?: string): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            this.rpcCall("connect", { server: url }).then(res => resolve(true)).catch(() => reject());
        });
    };

    is_connected = (): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            this.rpcCall("is_connected").then(res => resolve(
                ((res as EventData).payload as ConfirmResponsePayload).confirmed)
            ).catch(() => reject());
        });
    };
    protected processEvent = (data: EventData, callback: (content: any) => any) => {
        if (data.isSuccess) {
            window.ergo = MinotaurApi.getInstance();
            callback(data);
        }
    };
}


class MinotaurApi extends ExtensionConnector {
    private static instance?: MinotaurApi;
    protected processEventType: EventDataType = "call";


    static getInstance = () => {
        if (!MinotaurApi.instance) {
            MinotaurApi.instance = new MinotaurApi();
            MinotaurApi.instance.setup();
        }
        return MinotaurApi.instance;
    };

    get_utxos = (amount: bigint, token_id: string = "ERG", paginate?: Paginate): Promise<Array<Box> | undefined> => {
        return new Promise<Array<Box> | undefined>((resolve, reject) => {
            paginate = paginate ? paginate : { page: 1, limit: 100 };
            this.rpcCall("boxes", {
                amount: amount.toString(),
                tokenId: token_id,
                page: paginate
            }).then(res => {
                resolve(res.payload as BoxResponsePayload);
            }).catch((err: APIError | PaginateError) => reject(err));
        });
    };

    get_balance = (token_id: string): Promise<bigint> => {
        return this.get_balances(token_id).then(res => res as bigint);
    };

    get_balances = (token_id: string, ...token_ids: Array<string>): Promise<bigint | { [id: string]: bigint }> => {
        return new Promise<bigint | { [id: string]: bigint }>((resolve, reject) => {
            this.rpcCall("balance", { tokenIds: [token_id, ...token_ids] }).then(res => {
                const data = (res.payload as { [id: string]: string });
                const output: { [id: string]: bigint } = {};
                if (token_ids.length) {
                    output[token_id] = BigInt(data[token_id]);
                    token_ids.forEach(token => {
                        output[token] = BigInt(data[token]);
                    });
                    resolve(output);
                } else {
                    resolve(BigInt(data[token_id]));
                }
            }).catch((err: APIError) => reject(err));
        });
    };

    get_used_addresses = (paginate?: Paginate): Promise<Array<string>> => {
        return new Promise<Array<string>>((resolve, reject) => {
            this.rpcCall("address", { type: "used", page: paginate }).then(data => {
                resolve(data.payload as Array<string>);
            }).catch((err: APIError | PaginateError) => reject(err));
        });
    };

    get_unused_addresses = (paginate?: Paginate): Promise<Array<string>> => {
        return new Promise<Array<string>>((resolve, reject) => {
            this.rpcCall("address", { type: "unused", page: paginate }).then(data => {
                resolve(data.payload as Array<string>);
            }).catch((err: APIError | PaginateError) => reject(err));
        });
    };

    get_change_address = () => {
        return new Promise<string>((resolve, reject) => {
            this.rpcCall("address", { type: "change" }).then(data => {
                const addresses = data.payload as Array<string>;
                if (addresses.length > 0) {
                    resolve(addresses[0]);
                } else {
                    reject();
                }
            }).catch((err: APIError) => reject(err));
        });
    };
    sign_tx = (tx: Tx): Promise<SignedTx> => {
        return new Promise<SignedTx>((resolve, reject) => {
            this.rpcCall("sign", { tx: tx, index: "all" }).then(signed => {
                resolve(signed.payload as SignedTx);
            }).catch((err: APIError | TxSignError) => reject(err));
        });
    };

    sign_tx_input = (tx: Tx, index: number): Promise<SignedInput> => {
        return new Promise<SignedInput>((resolve, reject) => {
            this.rpcCall("sign", { tx: tx, index: index }).then(signed => {
                resolve(signed.payload as SignedInput);
            }).catch((err: APIError | TxSignError) => reject(err));
        });
    }

    sign_data = (address: string, message: string): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            reject({code: -1, info: "Not Implemented"})
        });
    }
}

if (window.ergoConnector !== undefined) {
    window.ergoConnector = {
        ...window.ergoConnector,
        minotaur: Object.freeze(MinotaurConnector.getInstance())
    };
} else {
    window.ergoConnector = {
        minotaur: Object.freeze(MinotaurConnector.getInstance())
    };
}

const warnDeprecated = function(func: string) {
    console.warn(
        "[Deprecated] In order to avoid conflicts with another wallets, this method will be disabled and replaced by '" +
        func +
        "' soon."
    );
};

if (!window.ergo_request_read_access && !window.ergo_check_read_access) {
    window.ergo_request_read_access = function() {
        warnDeprecated("ergoConnector.nautilus.connect()");
        return MinotaurConnector.getInstance().connect().then(res => null);
    };
    window.ergo_check_read_access = function() {
        warnDeprecated("ergoConnector.nautilus.isConnected()");
        return MinotaurConnector.getInstance().is_connected().then(res => null);
    };
}
