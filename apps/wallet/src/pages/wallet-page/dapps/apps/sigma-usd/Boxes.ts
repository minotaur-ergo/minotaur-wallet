import * as wasm from 'ergo-lib-wasm-browser';

import * as parameters from './parameters';

class Boxes {
  static implementorBox = (amount: bigint, height: number) => {
    return new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(amount.toString())),
      wasm.Contract.pay_to_address(
        wasm.Address.from_base58(parameters.IMPLEMENTOR),
      ),
      height,
    ).build();
  };

  static recipientBox = async (
    amount: bigint,
    tokenAmount: bigint,
    baseRequiredErg: bigint,
    userAddress: wasm.Address,
    height: number,
    tokens: Map<string, bigint>,
  ) => {
    const recipientBuilder = new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(amount.toString())),
      wasm.Contract.pay_to_address(userAddress),
      height,
    );
    for (const [tokenId, tokenAmount] of tokens.entries()) {
      if (tokenAmount > 0n) {
        recipientBuilder.add_token(
          wasm.TokenId.from_str(tokenId),
          wasm.TokenAmount.from_i64(wasm.I64.from_str(tokenAmount.toString())),
        );
      }
    }
    recipientBuilder.set_register_value(
      4,
      wasm.Constant.from_i64(wasm.I64.from_str(tokenAmount.toString())),
    );
    recipientBuilder.set_register_value(
      5,
      wasm.Constant.from_i64(wasm.I64.from_str(baseRequiredErg.toString())),
    );
    return recipientBuilder.build();
  };
}

export default Boxes;
