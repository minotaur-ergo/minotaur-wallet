import * as wasm from 'ergo-lib-wasm-browser';

class Oracle {
  static TOKEN_ID: string =
    '011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f';
  private readonly box: wasm.ErgoBox;

  constructor(box: wasm.ErgoBox) {
    this.box = box;
  }

  get_box = () => this.box;

  datapoint = () => {
    return BigInt(this.box.register_value(4)?.to_i64().to_str()!);
  };

  datapoint_in_cents = () => {
    return this.datapoint() / BigInt(100);
  };
}

export default Oracle;
