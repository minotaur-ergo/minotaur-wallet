import * as wasm from '@minotaur-ergo/ergo-lib';

const encoding = 'base64';
const serialize = (box: wasm.ErgoBox) =>
  Buffer.from(box.sigma_serialize_bytes()).toString(encoding);

const deserialize = (boxEncoded: string) =>
  wasm.ErgoBox.sigma_parse_bytes(Buffer.from(boxEncoded, encoding));

export { serialize, deserialize };
