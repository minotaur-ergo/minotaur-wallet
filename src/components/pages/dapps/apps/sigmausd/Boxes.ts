import * as wasm from 'ergo-lib-wasm-browser';
import * as parameters from './parameters';

class Boxes {
  static implementor_box = (amount: bigint, height: number) => {
    return new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(amount.toString())),
      wasm.Contract.pay_to_address(
        wasm.Address.from_base58(parameters.IMPLEMENTOR)
      ),
      height
    ).build();
  };

  static recipient_box = async (
    amount: bigint,
    token_amount: bigint,
    base_required_erg: bigint,
    user_address: wasm.Address,
    height: number,
    tokens: { [id: string]: bigint }
  ) => {
    const recipient_builder = new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(amount.toString())),
      wasm.Contract.pay_to_address(user_address),
      height
    );
    Object.keys(tokens).forEach((token_id) => {
      if (tokens[token_id] > BigInt(0)) {
        recipient_builder.add_token(
          wasm.TokenId.from_str(token_id),
          wasm.TokenAmount.from_i64(
            wasm.I64.from_str(tokens[token_id].toString())
          )
        );
      }
    });
    recipient_builder.set_register_value(
      4,
      wasm.Constant.from_i64(wasm.I64.from_str(token_amount.toString()))
    );
    recipient_builder.set_register_value(
      5,
      wasm.Constant.from_i64(wasm.I64.from_str(base_required_erg.toString()))
    );
    return recipient_builder.build();
  };
}

export default Boxes;
