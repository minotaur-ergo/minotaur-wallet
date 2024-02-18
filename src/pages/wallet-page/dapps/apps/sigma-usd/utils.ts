import * as wasm from 'ergo-lib-wasm-browser';
import Boxes from './Boxes';
import * as parameters from './parameters';
import Bank from './Bank';
import Oracle from './Oracle';
import { DAppPropsType } from '@/types/dapps';
import { boxesToArrayBox } from '@/utils/convert';
import { createEmptyArrayWithIndex } from '@/utils/functions';

export const formatWithDecimals = (amount: bigint, decimals: number) => {
  if (decimals <= 0) return amount.toString();
  const decimalFactor = BigInt(Math.pow(10, decimals));
  return `${(amount / decimalFactor).toString()}.${(amount % decimalFactor)
    .toString()
    .padStart(decimals, '0')}`;
};

export const createTx = (
  implementorFee: bigint,
  height: number,
  recipient: wasm.ErgoBoxCandidate,
  bankOut: wasm.ErgoBoxCandidate,
  boxes: wasm.ErgoBoxes,
  userAddress: wasm.Address,
  oracle: wasm.ErgoBox,
) => {
  const implementor = Boxes.implementorBox(implementorFee, height);
  const outputs = wasm.ErgoBoxCandidates.empty();
  outputs.add(bankOut);
  outputs.add(recipient);
  outputs.add(implementor);
  const txBuilder = wasm.TxBuilder.new(
    new wasm.BoxSelection(boxes, new wasm.ErgoBoxAssetsDataList()),
    outputs,
    height,
    wasm.BoxValue.from_i64(
      wasm.I64.from_str(parameters.MINT_TX_FEE.toString()),
    ),
    userAddress,
  );
  const dataInputs = new wasm.DataInputs();
  dataInputs.add(new wasm.DataInput(oracle.box_id()));
  txBuilder.set_data_inputs(dataInputs);
  return txBuilder.build();
};

export const getTotalTokens = (bank: wasm.ErgoBox, boxes: wasm.ErgoBoxes) => {
  let totalErg = 0n;
  const tokens = new Map<string, bigint>();
  const inputs = new wasm.ErgoBoxes(bank);
  boxesToArrayBox(boxes).forEach((box) => {
    inputs.add(box);
    totalErg += BigInt(box.value().as_i64().to_str());
    const boxTokens = box.tokens();
    createEmptyArrayWithIndex(boxTokens.len()).forEach((index) => {
      const token = boxTokens.get(index);
      const tokenId = token.id().to_str();
      const amount = BigInt(token.amount().as_i64().to_str());
      tokens.set(tokenId, amount + (tokens.get(tokenId) ?? 0n));
    });
  });
  return {
    totalErg,
    tokens,
    inputs,
  };
};

export const sellToken = async (
  tokenType: 'stable' | 'reserve',
  amount: bigint,
  bank: Bank,
  oracle: Oracle,
  props: DAppPropsType,
) => {
  const baseGettingErg =
    tokenType === 'stable'
      ? bank.baseAmountFromRedeemingStableCoin(amount)
      : bank.baseAmountFromRedeemingReserveCoin(amount);
  const implementorFee = parameters.IMPLEMENTOR_FEE(baseGettingErg);
  const totalIncomeErg =
    baseGettingErg - implementorFee - parameters.MINT_TX_FEE;
  const sellTokenId =
    tokenType === 'stable'
      ? Bank.STABLE_COIN_TOKEN_ID
      : Bank.RESERVE_COIN_TOKEN_ID;

  const boxes = await props.getCoveringForErgAndToken(
    parameters.MIN_BOX_VALUE,
    [{ id: sellTokenId, amount }],
  );
  if (!boxes.covered) {
    throw Error('Insufficient token');
  }
  const userAddress = wasm.Address.from_base58((await props.getAddresses())[0]);
  const height = await props.chain.getNetwork().getHeight();
  const { totalErg, tokens, inputs } = getTotalTokens(
    bank.getBox(),
    boxes.boxes,
  );
  const bankOut = bank.createCandidate(
    height,
    tokenType === 'stable' ? -amount : 0n,
    tokenType === 'stable' ? 0n : -amount,
  );
  tokens.set(sellTokenId, (tokens.get(sellTokenId) ?? 0n) - amount);
  const recipient = await Boxes.recipientBox(
    totalErg + totalIncomeErg,
    -amount,
    -baseGettingErg,
    userAddress,
    height,
    tokens,
  );
  const tx = createTx(
    implementorFee,
    height,
    recipient,
    bankOut,
    inputs,
    userAddress,
    oracle.getBox(),
  );
  props.signAndSendTx({
    tx: tx,
    boxes: inputs,
    dataBoxes: new wasm.ErgoBoxes(oracle.getBox()),
  });
};

export const buyToken = async (
  tokenType: 'stable' | 'reserve',
  amount: bigint,
  bank: Bank,
  oracle: Oracle,
  props: DAppPropsType,
) => {
  const baseRequiredErg =
    tokenType === 'stable'
      ? bank.baseCostToMintStableCoin(amount)
      : bank.baseCostToMintReserveCoin(amount);
  const implementorFee = parameters.IMPLEMENTOR_FEE(baseRequiredErg);
  const totalProcessErg =
    implementorFee + baseRequiredErg + parameters.MINT_TX_FEE;
  const boxes = await props.getCoveringForErgAndToken(
    totalProcessErg + parameters.MIN_BOX_VALUE,
    [],
  );
  if (!boxes.covered) {
    throw Error('Insufficient Erg');
  }
  const userAddress = wasm.Address.from_base58((await props.getAddresses())[0]);
  const height = await props.chain.getNetwork().getHeight();
  const { totalErg, tokens, inputs } = getTotalTokens(
    bank.getBox(),
    boxes.boxes,
  );
  const bankOut = bank.createCandidate(
    height,
    tokenType === 'stable' ? amount : 0n,
    tokenType === 'stable' ? 0n : amount,
  );
  const buyTokenId =
    tokenType === 'stable'
      ? Bank.STABLE_COIN_TOKEN_ID
      : Bank.RESERVE_COIN_TOKEN_ID;
  tokens.set(buyTokenId, (tokens.get(buyTokenId) ?? 0n) + amount);
  const recipient = await Boxes.recipientBox(
    totalErg - totalProcessErg,
    amount,
    baseRequiredErg,
    userAddress,
    height,
    tokens,
  );
  const tx = createTx(
    implementorFee,
    height,
    recipient,
    bankOut,
    inputs,
    userAddress,
    oracle.getBox(),
  );
  props.signAndSendTx({
    tx: tx,
    boxes: inputs,
    dataBoxes: new wasm.ErgoBoxes(oracle.getBox()),
  });
};
