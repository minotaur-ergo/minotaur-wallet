import * as wasm from '@minotaur-ergo/ergo-lib';
import { AbstractNetwork } from '@minotaur-ergo/types';
import JSONBigInt from 'json-bigint';

abstract class BaseNetwork extends AbstractNetwork {
  getContext = async () => {
    const headers = await this.getLastHeaders(10);
    const blockHeaders = wasm.BlockHeaders.from_json(
      headers.map((item) => JSONBigInt.stringify(item)),
    );
    const pre_header = wasm.PreHeader.from_block_header(blockHeaders.get(0));
    return new wasm.ErgoStateContext(
      pre_header,
      blockHeaders,
      wasm.Parameters.default_parameters(),
    );
  };
}

export { BaseNetwork };
