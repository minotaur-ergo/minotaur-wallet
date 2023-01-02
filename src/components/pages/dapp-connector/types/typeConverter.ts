import WalletWithErg from '../../../../db/entities/views/WalletWithErg';
import { SignedTx, Tx, Box } from './eipTypes';
import * as wasm from 'ergo-lib-wasm-browser';
import { UnsignedGeneratedTx } from '../../../../util/interface';
import JSONBig from 'json-bigint';

/**
 * convert Tx (EIP type) to UnsignedGeneratedTx to use in signTx function
 * @param utx : Tx
 * @returns Promise<UnsignedGeneratedTx>
 */
export const toUnsignedGeneratedTx = async (
  utx: Tx
): Promise<UnsignedGeneratedTx> => {
  const unspentBoxes = wasm.ErgoBoxes.from_boxes_json(utx.inputs);
  const dataInputBoxes = wasm.ErgoBoxes.from_boxes_json(utx.dataInputs);
  const tx = wasm.UnsignedTransaction.from_json(JSON.stringify(utx));

  const utxGenerated: UnsignedGeneratedTx = {
    tx: tx,
    boxes: unspentBoxes,
    data_inputs: dataInputBoxes,
  };

  return utxGenerated;
};

/**
 * convert wasm.Transaction to SignedTx
 * @param stx : wasm.Transaction
 * @returns Promise<SignedTx>
 */
export const toSignedTx = async (stx: wasm.Transaction): Promise<SignedTx> => {
  return JSONBig.parse(stx.to_json());
};

/**
 * convert signedTx (EIP type) to wasm.Transaction
 * @param signed : SignedTx
 * @returns Promise<wasm.Transaction>
 */
export const toTransaction = async (
  signed: SignedTx
): Promise<wasm.Transaction> => {
  return wasm.Transaction.from_json(JSON.stringify(signed));
};
