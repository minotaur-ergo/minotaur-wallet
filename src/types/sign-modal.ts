import * as wasm from 'ergo-lib-wasm-browser';

interface SignActionTemplated<T> {
  signTx: () => Promise<T>;
}

interface DisplayBoxAction {
  displayBoxes: () => Promise<unknown>;
}

type SignAndDisplayAction = SignActionTemplated<unknown> & DisplayBoxAction;

type SignAction = SignActionTemplated<wasm.Transaction>;

enum RegisterKeys {
  R4 = 4,
  R5 = 5,
  R6 = 6,
  R7 = 7,
  R8 = 8,
  R9 = 9,
}

interface ReceiverType {
  address: string;
  amount: bigint;
  tokens: ReceiverTokenType[];
  registers?: {
    [register in RegisterKeys]: wasm.Constant;
  };
}

interface ReceiverTokenType {
  id: string;
  amount: bigint;
}

interface BoxContent {
  address: string;
  amount: bigint;
  tokens: Array<ReceiverTokenType>;
}
export type {
  SignAction,
  DisplayBoxAction,
  SignAndDisplayAction,
  ReceiverType,
  ReceiverTokenType,
  BoxContent,
  RegisterKeys,
};
