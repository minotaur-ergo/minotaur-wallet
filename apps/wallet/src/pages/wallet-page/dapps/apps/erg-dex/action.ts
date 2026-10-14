import * as wasm from '@minotaur-ergo/ergo-lib';
import { DAppPropsType } from '@minotaur-ergo/types';

import {
  IMPLEMENTOR_ADDRESS,
  IMPLEMENTOR_FEE,
  MINIMUM_IMPLEMENTOR_FEE,
  PROXY_BOX_OVERHEAD,
  PROXY_ERGO_TREE_ERG_TO_RSN,
  TRANSACTION_FEE,
} from './parameters';

const proxyRegisterValue = Uint8Array.from(Buffer.from('Mew'));
const proxyContract = wasm.Contract.new(
  wasm.ErgoTree.from_base16_bytes(PROXY_ERGO_TREE_ERG_TO_RSN),
);

export const createErgToRsnOrder = async (
  props: DAppPropsType,
  ergAmount: bigint,
) => {
  if (props.chain.prefix !== wasm.NetworkPrefix.Mainnet) {
    throw new Error('ErgoDEX is only available on mainnet');
  }

  if (ergAmount <= 0n) {
    throw new Error('Enter an ERG amount greater than zero');
  }

  const implementorFee = IMPLEMENTOR_FEE(ergAmount);
  if (implementorFee < MINIMUM_IMPLEMENTOR_FEE) {
    throw new Error('Swap amount is too small to cover the minimum fee box');
  }

  const minimumUserBox = BigInt(
    wasm.BoxValue.SAFE_USER_MIN().as_i64().to_str(),
  );
  const proxyAmount = ergAmount + minimumUserBox + PROXY_BOX_OVERHEAD;
  const requiredErg = proxyAmount + implementorFee + TRANSACTION_FEE;
  const covering = await props.getCoveringForErgAndToken(requiredErg, []);
  if (!covering.covered) {
    throw new Error(
      'Insufficient ERG to cover the swap, fee, and transaction fee',
    );
  }

  const userAddress = await props.getDefaultAddress();
  const height = await props.chain.getNetwork().getHeight();
  const outputs = wasm.ErgoBoxCandidates.empty();

  const proxyBuilder = new wasm.ErgoBoxCandidateBuilder(
    wasm.BoxValue.from_i64(wasm.I64.from_str(proxyAmount.toString())),
    proxyContract,
    height,
  );
  proxyBuilder.set_register_value(
    4,
    wasm.Constant.from_byte_array(proxyRegisterValue),
  );
  outputs.add(proxyBuilder.build());

  const implementorOutput = new wasm.ErgoBoxCandidateBuilder(
    wasm.BoxValue.from_i64(wasm.I64.from_str(implementorFee.toString())),
    wasm.Contract.pay_to_address(wasm.Address.from_base58(IMPLEMENTOR_ADDRESS)),
    height,
  ).build();
  outputs.add(implementorOutput);

  const changeBoxes = await props.createChangeBox(
    covering.boxes,
    outputs,
    TRANSACTION_FEE,
    height,
  );
  changeBoxes.forEach((box) => outputs.add(box));

  const tx = wasm.TxBuilder.new(
    new wasm.BoxSelection(covering.boxes, new wasm.ErgoBoxAssetsDataList()),
    outputs,
    height,
    wasm.BoxValue.from_i64(wasm.I64.from_str(TRANSACTION_FEE.toString())),
    wasm.Address.from_base58(userAddress),
  ).build();

  await props.signAndSendTx({ tx, boxes: covering.boxes });
};
