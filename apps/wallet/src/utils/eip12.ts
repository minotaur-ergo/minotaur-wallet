import * as wasm from '@minotaur-ergo/ergo-lib';

interface JsonAsset {
  tokenId: string;
  amount: string | number;
}

interface JsonBoxCandidate {
  value: string | number;
  ergoTree: string;
  assets: Array<JsonAsset>;
}

interface JsonBox extends JsonBoxCandidate {
  boxId: string;
}

interface JsonTx {
  inputs: Array<{ boxId: string }>;
  outputs: Array<JsonBoxCandidate>;
}

const txToJson = (tx: wasm.UnsignedTransaction | wasm.Transaction) =>
  tx.to_js_eip12() as JsonTx;

const boxesToJsonMap = (boxes: Array<wasm.ErgoBox>) => {
  const res = new Map<string, JsonBox>();
  boxes.forEach((box) => {
    const jsonBox = box.to_js_eip12() as JsonBox;
    res.set(jsonBox.boxId, jsonBox);
  });
  return res;
};

// boxes in a tx share few ergo trees, so convert each tree to address only once
const createAddressResolver = (prefix: wasm.NetworkPrefix) => {
  const cache = new Map<string, string>();
  return (ergoTree: string) => {
    let address = cache.get(ergoTree);
    if (address === undefined) {
      address = wasm.Address.recreate_from_ergo_tree(
        wasm.ErgoTree.from_base16_bytes(ergoTree),
      ).to_base58(prefix);
      cache.set(ergoTree, address);
    }
    return address;
  };
};

export type { JsonAsset, JsonBox, JsonBoxCandidate, JsonTx };
export { txToJson, boxesToJsonMap, createAddressResolver };
