import * as wasm from '@minotaur/ergo-lib';

class Oracle {
  static TOKEN_ID =
    '011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f';
  private readonly box: wasm.ErgoBox;

  constructor(box: wasm.ErgoBox) {
    this.box = box;
  }

  getBox = () => this.box;

  dataPoint = () => {
    const R4 = this.box.register_value(4);
    return BigInt(R4 ? R4.to_i64().to_str() : 0);
  };

  dataPointInCents = () => {
    return this.dataPoint() / BigInt(100);
  };
}

export default Oracle;
