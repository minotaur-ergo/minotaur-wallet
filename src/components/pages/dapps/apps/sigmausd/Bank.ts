import * as wasm from 'ergo-lib-wasm-browser';
import * as parameters from './parameters';
import Oracle from './Oracle';

const reserve_ratio = (
  base_reserves: bigint,
  circulating_stable_coins: bigint,
  oracle_rate: bigint
) => {
  if (base_reserves === BigInt(0) || oracle_rate === BigInt(0)) return 0;
  if (circulating_stable_coins === BigInt(0))
    return (base_reserves * BigInt(100)) / oracle_rate;
  const per_stable_coin_rate =
    (base_reserves * BigInt(100)) / circulating_stable_coins;
  return per_stable_coin_rate / oracle_rate;
};

class Bank {
  static NFT_TOKEN_ID =
    '7d672d1def471720ca5782fd6473e47e796d9ac0c138d9911346f118b2f6d9d9';
  static STABLE_COIN_TOKEN_ID =
    '03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04';
  static RESERVE_COIN_TOKEN_ID =
    '003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0';
  private readonly box: wasm.ErgoBox;
  private readonly oracle: Oracle;

  constructor(box: wasm.ErgoBox, oracle: Oracle) {
    this.box = box;
    this.oracle = oracle;
  }

  get_box = () => this.box;

  current_reserve_ratio = () => {
    return reserve_ratio(
      this.base_reserve(),
      this.num_circulating_stable_coins(),
      this.oracle.datapoint_in_cents()
    );
  };

  base_reserve = () => {
    const value = BigInt(this.box.value().as_i64().to_str());
    return value < parameters.MIN_BOX_VALUE ? BigInt(0) : value;
  };

  liabilities = () => {
    const num_coins = this.num_circulating_stable_coins();
    if (num_coins === BigInt(0)) return BigInt(0);
    const base_reserves_needed = num_coins * this.oracle.datapoint_in_cents();
    const base_reserve = this.base_reserve();
    return base_reserves_needed < base_reserve
      ? base_reserves_needed
      : base_reserve;
  };

  equity = () => {
    const base_reserve = this.base_reserve();
    const liabilities = this.liabilities();
    return liabilities < base_reserve ? base_reserve - liabilities : BigInt(0);
  };

  num_circulating_stable_coins = () => {
    return BigInt(this.box?.register_value(4)!.to_i64().to_str());
  };

  num_circulating_reserve_coins = () => {
    return BigInt(this.box?.register_value(5)!.to_i64().to_str());
  };

  stable_coin_nominal_price = () => {
    const oracle_rate = this.oracle.datapoint_in_cents();
    const liabilities = this.liabilities();
    const num_stable_coins = this.num_circulating_stable_coins();
    return num_stable_coins === BigInt(0) ||
      oracle_rate < liabilities / num_stable_coins
      ? oracle_rate
      : liabilities / num_stable_coins;
  };

  reserve_coin_nominal_price = () => {
    const num_circulating_reserve_coins = this.num_circulating_reserve_coins();
    const equity = this.equity();
    if (num_circulating_reserve_coins <= BigInt(1) || equity === BigInt(0)) {
      return parameters.RESERVE_COIN_DEFAULT_PRICE;
    }
    return equity / num_circulating_reserve_coins;
  };

  able_to_mint_stable_coin = (amount: bigint) => {
    const new_reserve = this.mint_stable_coin_reserve_ratio(amount);
    return new_reserve >= parameters.MIN_RESERVE_RATIO;
  };

  num_able_to_mint_stable_coin = () => {
    if (!this.able_to_mint_stable_coin(BigInt(1))) return BigInt(0);
    let low = this.equity() / this.oracle.datapoint_in_cents() / BigInt(4);
    // TODO check index of stable token
    let high = BigInt(this.box.tokens().get(0).amount().as_i64().to_str());
    while (low <= high) {
      const mid = (high - low) / BigInt(2) + low;
      const new_reserve_ratio = this.mint_stable_coin_reserve_ratio(mid);
      if (new_reserve_ratio === parameters.MIN_RESERVE_RATIO) return mid;
      if (new_reserve_ratio < parameters.MIN_RESERVE_RATIO) {
        high = mid - BigInt(1);
      } else {
        low = mid + BigInt(1);
      }
    }
    return low;
  };

  mint_stable_coin_reserve_ratio = (amount: bigint) => {
    const new_base_reserve =
      this.base_reserve() + this.base_cost_to_mint_stable_coin(amount);
    return reserve_ratio(
      new_base_reserve,
      this.num_circulating_stable_coins() + amount,
      this.oracle.datapoint_in_cents()
    );
  };

  able_to_mint_reserve_coin_amount = (amount: bigint) => {
    const new_reserve_ratio = this.mint_reserve_coin_reserve_ratio(amount);
    return new_reserve_ratio <= BigInt(parameters.MAX_RESERVE_RATIO);
  };

  num_able_to_mint_reserve_coin = () => {
    if (!this.able_to_mint_reserve_coin_amount(BigInt(1))) return BigInt(0);
    let low = BigInt(0);
    // TODO check token id for reserve coin
    let high = BigInt(
      this.get_box().tokens().get(1).amount().as_i64().to_str()
    );
    const MAX_RESERVE_RATIO = BigInt(parameters.MAX_RESERVE_RATIO);
    while (low <= high) {
      const mid = (high - low) / BigInt(2) + low;
      const new_reserve_ratio = this.mint_reserve_coin_reserve_ratio(mid);
      if (new_reserve_ratio === MAX_RESERVE_RATIO) return mid;
      if (new_reserve_ratio > MAX_RESERVE_RATIO) {
        high = mid - BigInt(1);
      } else {
        low = mid + BigInt(1);
      }
    }
    return low;
  };

  mint_reserve_coin_reserve_ratio = (amount: bigint) => {
    const new_base_reserve =
      this.base_reserve() + this.base_cost_to_mint_reserve_coin(amount);
    return reserve_ratio(
      new_base_reserve,
      this.num_circulating_stable_coins(),
      this.oracle.datapoint_in_cents()
    );
  };

  able_to_redeem_reserve_coin_amount = (amount: bigint) => {
    const new_reserve_ratio = this.redeem_reserve_coin_reserve_ratio(amount);
    return new_reserve_ratio >= parameters.MIN_RESERVE_RATIO;
  };

  num_able_to_redeem_reserve_coin = () => {
    if (
      this.redeem_reserve_coin_reserve_ratio(BigInt(1)) <=
      parameters.MIN_RESERVE_RATIO
    )
      return BigInt(0);
    let low = BigInt(0);
    let high = this.num_circulating_stable_coins();
    while (low < high) {
      const mid = (high - low) / BigInt(2) + low;
      const new_reserve_ratio = this.redeem_reserve_coin_reserve_ratio(mid);
      if (new_reserve_ratio === parameters.MIN_RESERVE_RATIO) return mid;
      if (new_reserve_ratio < parameters.MIN_RESERVE_RATIO)
        high = mid - BigInt(1);
      else low = mid + BigInt(1);
    }
    return low;
  };

  redeem_reserve_coin_reserve_ratio = (amount: bigint) => {
    const redeem_amount = this.base_cost_to_mint_reserve_coin(amount);
    let new_base_reserve = BigInt(0);
    const base_reserve = this.base_reserve();
    if (redeem_amount < base_reserve) {
      new_base_reserve = base_reserve - redeem_amount;
    }
    return reserve_ratio(
      new_base_reserve,
      this.num_circulating_stable_coins(),
      this.oracle.datapoint_in_cents()
    );
  };

  total_cost_to_mint_stable_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const base_cost = this.base_cost_to_mint_stable_coin(amount);
    return (
      base_cost +
      transaction_fee +
      parameters.MIN_BOX_VALUE * BigInt(2) +
      parameters.IMPLEMENTOR_FEE(base_cost)
    );
  };

  fees_from_minting_stable_coin = (amount: bigint, transaction_fee: bigint) => {
    const fee_less_amount = this.stable_coin_nominal_price() * amount;
    const protocol_fee =
      fee_less_amount + parameters.PROTOCOL_FEE(fee_less_amount);
    const implementor_fee = parameters.IMPLEMENTOR_FEE(
      fee_less_amount + protocol_fee
    );
    return transaction_fee + protocol_fee + implementor_fee;
  };

  base_cost_to_mint_stable_coin = (amount: bigint) => {
    const fee_less_amount = this.stable_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    return fee_less_amount + protocol_fee;
  };

  total_cost_to_mint_reserve_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const base_cost = this.base_cost_to_mint_reserve_coin(amount);
    return (
      base_cost +
      transaction_fee +
      parameters.MIN_BOX_VALUE * BigInt(2) +
      parameters.IMPLEMENTOR_FEE(base_cost)
    );
  };

  fees_from_minting_reserve_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const fee_less_amount = this.reserve_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    const implementor_fee = parameters.IMPLEMENTOR_FEE(
      this.base_cost_to_mint_stable_coin(amount)
    );
    return transaction_fee + protocol_fee + implementor_fee;
  };

  base_cost_to_mint_reserve_coin = (amount: bigint) => {
    const fee_less_amount = this.reserve_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    return fee_less_amount + protocol_fee;
  };

  total_amount_from_redeeming_reserve_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const base_amount = this.base_amount_from_redeeming_reserve_coin(amount);
    const fees = transaction_fee + parameters.IMPLEMENTOR_FEE(base_amount);
    return base_amount < fees ? base_amount - fees : BigInt(0);
  };

  fees_from_redeeming_reserve_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const fee_less_amount = this.reserve_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    const implementor_fee = parameters.IMPLEMENTOR_FEE(
      this.base_amount_from_redeeming_reserve_coin(amount)
    );
    return transaction_fee + protocol_fee + implementor_fee;
  };

  base_amount_from_redeeming_reserve_coin = (amount: bigint) => {
    const fee_less_amount = this.reserve_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    return fee_less_amount - protocol_fee;
  };

  total_amount_from_redeeming_stable_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const base_amount = this.base_amount_from_redeeming_stable_coin(amount);
    const fees = transaction_fee + parameters.IMPLEMENTOR_FEE(base_amount);
    return base_amount < fees ? base_amount - fees : BigInt(0);
  };

  fees_from_redeeming_stable_coin = (
    amount: bigint,
    transaction_fee: bigint
  ) => {
    const fee_less_amount = this.stable_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    const implementor_fee = parameters.IMPLEMENTOR_FEE(
      fee_less_amount + protocol_fee
    );
    return protocol_fee + transaction_fee + implementor_fee;
  };

  base_amount_from_redeeming_stable_coin = (amount: bigint) => {
    const fee_less_amount = this.stable_coin_nominal_price() * amount;
    const protocol_fee = parameters.PROTOCOL_FEE(fee_less_amount);
    return fee_less_amount - protocol_fee;
  };

  get_erg_usd = () => {
    return BigInt(1e9) / this.stable_coin_nominal_price();
  };

  get_erg_rsv = () => {
    return BigInt(1e9) / this.reserve_coin_nominal_price();
  };

  create_candidate = (
    height: number,
    adding_stable_count: bigint,
    adding_reserve_count: bigint
  ) => {
    const old_value = BigInt(this.get_box().value().as_i64().to_str());
    let adding_erg_count = BigInt(0);
    if (adding_stable_count > BigInt(0)) {
      adding_erg_count +=
        this.base_cost_to_mint_stable_coin(adding_stable_count);
    } else if (adding_stable_count < BigInt(0)) {
      adding_erg_count -= this.base_amount_from_redeeming_stable_coin(
        -adding_stable_count
      );
    } else if (adding_reserve_count > BigInt(0)) {
      adding_erg_count +=
        this.base_cost_to_mint_reserve_coin(adding_reserve_count);
    } else if (adding_reserve_count < BigInt(0)) {
      adding_erg_count -= this.base_amount_from_redeeming_reserve_coin(
        -adding_reserve_count
      );
    } else {
      throw Error('one of stable or reserve tokens must change');
    }
    const bankOutBuilder = new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(
        wasm.I64.from_str((old_value + adding_erg_count).toString())
      ),
      wasm.Contract.pay_to_address(
        wasm.Address.recreate_from_ergo_tree(this.box.ergo_tree())
      ),
      height
    );
    const stable_token = this.box.tokens().get(0);
    const reserve_token = this.box.tokens().get(1);
    const nft_token = this.box.tokens().get(2);
    bankOutBuilder.add_token(
      stable_token.id(),
      wasm.TokenAmount.from_i64(
        wasm.I64.from_str(
          (
            BigInt(stable_token.amount().as_i64().to_str()) -
            adding_stable_count
          ).toString()
        )
      )
    );
    bankOutBuilder.add_token(
      reserve_token.id(),
      wasm.TokenAmount.from_i64(
        wasm.I64.from_str(
          (
            BigInt(reserve_token.amount().as_i64().to_str()) -
            adding_reserve_count
          ).toString()
        )
      )
    );
    bankOutBuilder.add_token(nft_token.id(), nft_token.amount());
    bankOutBuilder.set_register_value(
      4,
      wasm.Constant.from_i64(
        wasm.I64.from_str(
          (this.num_circulating_stable_coins() + adding_stable_count).toString()
        )
      )
    );
    bankOutBuilder.set_register_value(
      5,
      wasm.Constant.from_i64(
        wasm.I64.from_str(
          (
            this.num_circulating_reserve_coins() + adding_reserve_count
          ).toString()
        )
      )
    );
    return bankOutBuilder.build();
  };
}

export default Bank;
