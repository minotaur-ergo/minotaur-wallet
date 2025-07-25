import * as wasm from 'ergo-lib-wasm-browser';

import Oracle from './Oracle';
import * as parameters from './parameters';

const reserveRatio = (
  base_reserves: bigint,
  circulating_stable_coins: bigint,
  oracle_rate: bigint,
) => {
  if (base_reserves === BigInt(0) || oracle_rate === BigInt(0)) return 0n;
  if (circulating_stable_coins === BigInt(0))
    return (base_reserves * BigInt(100)) / oracle_rate;
  const perStableCoinRate =
    (base_reserves * BigInt(100)) / circulating_stable_coins;
  return perStableCoinRate / oracle_rate;
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

  getBox = () => this.box;

  currentReserveRatio = () => {
    return reserveRatio(
      this.baseReserve(),
      this.numCirculatingStableCoins(),
      this.oracle.dataPointInCents(),
    );
  };

  baseReserve = () => {
    const value = BigInt(this.box.value().as_i64().to_str());
    return value < parameters.MIN_BOX_VALUE ? BigInt(0) : value;
  };

  liabilities = () => {
    const numCoins = this.numCirculatingStableCoins();
    if (numCoins === BigInt(0)) return BigInt(0);
    const baseReservesNeeded = numCoins * this.oracle.dataPointInCents();
    const baseReserve = this.baseReserve();
    return baseReservesNeeded < baseReserve ? baseReservesNeeded : baseReserve;
  };

  equity = () => {
    const baseReserve = this.baseReserve();
    const liabilities = this.liabilities();
    return liabilities < baseReserve ? baseReserve - liabilities : BigInt(0);
  };

  numCirculatingStableCoins = () => {
    const R4 = this.box.register_value(4);
    return BigInt(R4 ? R4.to_i64().to_str() : '0');
  };

  numCirculatingReserveCoins = () => {
    const R5 = this.box.register_value(5);
    return BigInt(R5 ? R5.to_i64().to_str() : '0');
  };

  stableCoinNominalPrice = () => {
    const oracleRate = this.oracle.dataPointInCents();
    const liabilities = this.liabilities();
    const numStableCoins = this.numCirculatingStableCoins();
    return numStableCoins === BigInt(0) ||
      oracleRate < liabilities / numStableCoins
      ? oracleRate
      : liabilities / numStableCoins;
  };

  reserveCoinNominalPrice = () => {
    const numCirculatingReserveCoins = this.numCirculatingReserveCoins();
    const equity = this.equity();
    if (numCirculatingReserveCoins <= BigInt(1) || equity === BigInt(0)) {
      return parameters.RESERVE_COIN_DEFAULT_PRICE;
    }
    return equity / numCirculatingReserveCoins;
  };

  ableToMintStableCoin = (amount: bigint) => {
    const newReserve = this.mintStableCoinReserveRatio(amount);
    return newReserve >= parameters.MIN_RESERVE_RATIO;
  };

  numAbleToMintStableCoin = () => {
    if (!this.ableToMintStableCoin(BigInt(1))) return BigInt(0);
    let low = this.equity() / this.oracle.dataPointInCents() / BigInt(4);
    // TODO check index of stable token
    let high = BigInt(this.box.tokens().get(0).amount().as_i64().to_str());
    while (low <= high) {
      const mid = (high - low) / BigInt(2) + low;
      const newReserveRatio = this.mintStableCoinReserveRatio(mid);
      if (newReserveRatio === parameters.MIN_RESERVE_RATIO) return mid;
      if (newReserveRatio < parameters.MIN_RESERVE_RATIO) {
        high = mid - BigInt(1);
      } else {
        low = mid + BigInt(1);
      }
    }
    return low;
  };

  mintStableCoinReserveRatio = (amount: bigint) => {
    const newBaseReserve =
      this.baseReserve() + this.baseCostToMintStableCoin(amount);
    return reserveRatio(
      newBaseReserve,
      this.numCirculatingStableCoins() + amount,
      this.oracle.dataPointInCents(),
    );
  };

  ableToMintReserveCoinAmount = (amount: bigint) => {
    const newReserveRatio = this.mintReserveCoinReserveRatio(amount);
    return newReserveRatio <= BigInt(parameters.MAX_RESERVE_RATIO);
  };

  numAbleToMintReserveCoin = () => {
    if (!this.ableToMintReserveCoinAmount(BigInt(1))) return BigInt(0);
    let low = BigInt(0);
    // TODO check token id for reserve coin
    let high = BigInt(this.getBox().tokens().get(1).amount().as_i64().to_str());
    while (low <= high) {
      const mid = (high - low) / BigInt(2) + low;
      const newReserveRatio = this.mintReserveCoinReserveRatio(mid);
      if (newReserveRatio === parameters.MAX_RESERVE_RATIO) return mid;
      if (newReserveRatio > parameters.MAX_RESERVE_RATIO) {
        high = mid - BigInt(1);
      } else {
        low = mid + BigInt(1);
      }
    }
    return low;
  };

  mintReserveCoinReserveRatio = (amount: bigint) => {
    const newBaseReserve =
      this.baseReserve() + this.baseCostToMintReserveCoin(amount);
    return reserveRatio(
      newBaseReserve,
      this.numCirculatingStableCoins(),
      this.oracle.dataPointInCents(),
    );
  };

  ableToRedeemReserveCoinAmount = (amount: bigint) => {
    const newReserveRatio = this.redeemReserveCoinReserveRatio(amount);
    return newReserveRatio >= parameters.MIN_RESERVE_RATIO;
  };

  numAbleToRedeemReserveCoin = () => {
    if (
      this.redeemReserveCoinReserveRatio(BigInt(1)) <=
      parameters.MIN_RESERVE_RATIO
    )
      return BigInt(0);
    let low = BigInt(0);
    let high = this.numCirculatingStableCoins();
    while (low < high) {
      const mid = (high - low) / BigInt(2) + low;
      const newReserveRatio = this.redeemReserveCoinReserveRatio(mid);
      if (newReserveRatio === parameters.MIN_RESERVE_RATIO) return mid;
      if (newReserveRatio < parameters.MIN_RESERVE_RATIO)
        high = mid - BigInt(1);
      else low = mid + BigInt(1);
    }
    return low;
  };

  redeemReserveCoinReserveRatio = (amount: bigint) => {
    const redeemAmount = this.baseCostToMintReserveCoin(amount);
    let newBaseReserve = BigInt(0);
    const baseReserve = this.baseReserve();
    if (redeemAmount < baseReserve) {
      newBaseReserve = baseReserve - redeemAmount;
    }
    return reserveRatio(
      newBaseReserve,
      this.numCirculatingStableCoins(),
      this.oracle.dataPointInCents(),
    );
  };

  totalCostToMintStableCoin = (amount: bigint, transactionFee: bigint) => {
    const baseCost = this.baseCostToMintStableCoin(amount);
    return (
      baseCost +
      transactionFee +
      parameters.MIN_BOX_VALUE * BigInt(2) +
      parameters.IMPLEMENTOR_FEE(baseCost)
    );
  };

  feesFromMintingStableCoin = (amount: bigint, transactionFee: bigint) => {
    const feeLessAmount = this.stableCoinNominalPrice() * amount;
    const protocolFee = feeLessAmount + parameters.PROTOCOL_FEE(feeLessAmount);
    const implementorFee = parameters.IMPLEMENTOR_FEE(
      feeLessAmount + protocolFee,
    );
    return transactionFee + protocolFee + implementorFee;
  };

  baseCostToMintStableCoin = (amount: bigint) => {
    const feeLessAmount = this.stableCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    return feeLessAmount + protocolFee;
  };

  totalCostToMintReserveCoin = (amount: bigint, transactionFee: bigint) => {
    const baseCost = this.baseCostToMintReserveCoin(amount);
    return (
      baseCost +
      transactionFee +
      parameters.MIN_BOX_VALUE * BigInt(2) +
      parameters.IMPLEMENTOR_FEE(baseCost)
    );
  };

  feesFromMintingReserveCoin = (amount: bigint, transactionFee: bigint) => {
    const feeLessAmount = this.reserveCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    const implementorFee = parameters.IMPLEMENTOR_FEE(
      this.baseCostToMintStableCoin(amount),
    );
    return transactionFee + protocolFee + implementorFee;
  };

  baseCostToMintReserveCoin = (amount: bigint) => {
    const feeLessAmount = this.reserveCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    return feeLessAmount + protocolFee;
  };

  totalAmountFromRedeemingReserveCoin = (
    amount: bigint,
    transactionFee: bigint,
  ) => {
    const baseAmount = this.baseAmountFromRedeemingReserveCoin(amount);
    const fees = transactionFee + parameters.IMPLEMENTOR_FEE(baseAmount);
    return baseAmount < fees ? baseAmount - fees : BigInt(0);
  };

  feesFromRedeemingReserveCoin = (amount: bigint, transactionFee: bigint) => {
    const feeLessAmount = this.reserveCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    const implementorFee = parameters.IMPLEMENTOR_FEE(
      this.baseAmountFromRedeemingReserveCoin(amount),
    );
    return transactionFee + protocolFee + implementorFee;
  };

  baseAmountFromRedeemingReserveCoin = (amount: bigint) => {
    const feeLessAmount = this.reserveCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    return feeLessAmount - protocolFee;
  };

  totalAmountFromRedeemingStableCoin = (
    amount: bigint,
    transactionFee: bigint,
  ) => {
    const baseAmount = this.baseAmountFromRedeemingStableCoin(amount);
    const fees = transactionFee + parameters.IMPLEMENTOR_FEE(baseAmount);
    return baseAmount < fees ? baseAmount - fees : BigInt(0);
  };

  feesFromRedeemingStableCoin = (amount: bigint, transactionFee: bigint) => {
    const feeLessAmount = this.stableCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    const implementorFee = parameters.IMPLEMENTOR_FEE(
      feeLessAmount + protocolFee,
    );
    return protocolFee + transactionFee + implementorFee;
  };

  baseAmountFromRedeemingStableCoin = (amount: bigint) => {
    const feeLessAmount = this.stableCoinNominalPrice() * amount;
    const protocolFee = parameters.PROTOCOL_FEE(feeLessAmount);
    return feeLessAmount - protocolFee;
  };

  getErgUsd = () => {
    return BigInt(1e9) / this.stableCoinNominalPrice();
  };

  getErgRsv = () => {
    return BigInt(1e9) / this.reserveCoinNominalPrice();
  };

  createCandidate = (
    height: number,
    addingStableCount: bigint,
    addingReserveCount: bigint,
  ) => {
    const oldValue = BigInt(this.getBox().value().as_i64().to_str());
    let addingErgCount = BigInt(0);
    if (addingStableCount > BigInt(0)) {
      addingErgCount += this.baseCostToMintStableCoin(addingStableCount);
    } else if (addingStableCount < BigInt(0)) {
      addingErgCount -=
        this.baseAmountFromRedeemingStableCoin(-addingStableCount);
    } else if (addingReserveCount > BigInt(0)) {
      addingErgCount += this.baseCostToMintReserveCoin(addingReserveCount);
    } else if (addingReserveCount < BigInt(0)) {
      addingErgCount -=
        this.baseAmountFromRedeemingReserveCoin(-addingReserveCount);
    } else {
      throw Error('one of stable or reserve tokens must change');
    }
    const bankOutBuilder = new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(
        wasm.I64.from_str((oldValue + addingErgCount).toString()),
      ),
      wasm.Contract.pay_to_address(
        wasm.Address.recreate_from_ergo_tree(this.box.ergo_tree()),
      ),
      height,
    );
    const tokens = this.box.tokens();
    const stableToken = tokens.get(0);
    const reserveToken = tokens.get(1);
    const nftToken = tokens.get(2);
    bankOutBuilder.add_token(
      stableToken.id(),
      wasm.TokenAmount.from_i64(
        wasm.I64.from_str(
          (
            BigInt(stableToken.amount().as_i64().to_str()) - addingStableCount
          ).toString(),
        ),
      ),
    );
    bankOutBuilder.add_token(
      reserveToken.id(),
      wasm.TokenAmount.from_i64(
        wasm.I64.from_str(
          (
            BigInt(reserveToken.amount().as_i64().to_str()) - addingReserveCount
          ).toString(),
        ),
      ),
    );
    bankOutBuilder.add_token(nftToken.id(), nftToken.amount());
    bankOutBuilder.set_register_value(
      4,
      wasm.Constant.from_i64(
        wasm.I64.from_str(
          (this.numCirculatingStableCoins() + addingStableCount).toString(),
        ),
      ),
    );
    bankOutBuilder.set_register_value(
      5,
      wasm.Constant.from_i64(
        wasm.I64.from_str(
          (this.numCirculatingReserveCoins() + addingReserveCount).toString(),
        ),
      ),
    );
    return bankOutBuilder.build();
  };
}

export default Bank;
