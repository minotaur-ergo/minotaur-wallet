import * as wasm from 'ergo-lib-wasm-browser';

export const RESERVE_COIN_DEFAULT_PRICE = BigInt(1000000);
export const MIN_BOX_VALUE = BigInt(10000000);

export const IMPLEMENTOR_FEE = (amount: bigint) => {
  const value: bigint = (amount * BigInt(2)) / BigInt(1000);
  const minValue = BigInt(wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str());
  return value < minValue ? minValue : value;
};

export const PROTOCOL_FEE = (amount: bigint) =>
  (amount * BigInt(2)) / BigInt(100);
export const MIN_RESERVE_RATIO = BigInt(400);
export const MAX_RESERVE_RATIO = BigInt(800);

export const MINT_TX_FEE = BigInt(2000000);

export const COOLING_OFF_HEIGHT = 460000;

export const IMPLEMENTOR =
  '9hN2UY1ZvvWMeWRBso28vSyjrAAfGJHh2DkZpE47J7Wqr51YLAR';
