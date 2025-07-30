import { useContext } from 'react';

import {
  DAppPropsType,
  StateWallet,
  TokenBalanceBigInt,
  UnsignedGeneratedTx,
} from '@minotaur-ergo/types';
import {
  boxArrayToBoxes,
  boxCandidatesToArrayBoxCandidate,
  boxesToArrayBox,
  getChain,
} from '@minotaur-ergo/utils';
import { createEmptyArrayWithIndex, dottedText } from '@minotaur/common';
import * as wasm from 'ergo-lib-wasm-browser';

import { deserialize } from '@/action/box';
import { AssetDbAction, BoxDbAction } from '@/action/db';
import { generateChangeBox, selectBoxes } from '@/action/tx';
import MessageContext from '@/components/app/messageContext';
import TxSignContext from '@/components/sign/context/TxSignContext';

const selectBoxesDApps =
  (wallet: StateWallet) =>
  async (
    amount: bigint,
    tokens: Array<TokenBalanceBigInt>,
    address?: string,
  ) => {
    const addressIds = wallet.addresses
      .filter((item) => address === undefined || item.address === address)
      .map((item) => item.id);
    const res = await selectBoxes(amount, tokens, addressIds);
    return {
      covered: res.covered,
      boxes: boxArrayToBoxes(res.boxes),
    };
  };

export const useDAppConnectorProps = (wallet: StateWallet): DAppPropsType => {
  const message = useContext(MessageContext);
  const txSign = useContext(TxSignContext);
  const addresses = [...wallet.addresses].sort((a, b) => {
    return a.isDefault === b.isDefault ? a.idx - b.idx : a.isDefault ? -1 : 1;
  });
  return {
    walletId: wallet.id,
    getAddresses: async () => addresses.map((item) => item.address),
    getDefaultAddress: async () => addresses[0].address,
    getCoveringForErgAndToken: selectBoxesDApps(wallet),
    chain: getChain(wallet.networkType),
    getAssets: async () => {
      const assets = new Map<string, bigint>();
      BoxDbAction.getInstance()
        .getAddressUnspentBoxes(wallet.addresses.map((item) => item.id))
        .then((boxes) =>
          boxes.map((box) => {
            const ergoBox = deserialize(box.serialized);
            const tokens = ergoBox.tokens();
            createEmptyArrayWithIndex(tokens.len()).forEach((index) => {
              const token = tokens.get(index);
              assets.set(
                token.id().to_str(),
                (assets.get(token.id().to_str()) ?? 0n) +
                  BigInt(token.amount().as_i64().to_str()),
              );
            });
          }),
        );
      return AssetDbAction.getInstance()
        .getAllAsset(wallet.networkType)
        .then((res) => {
          return res
            .map((item) => {
              return {
                amount: assets.get(item.asset_id) ?? 0n,
                id: item.asset_id,
                name: item.name ?? dottedText(item.asset_id, 4),
                decimal: item.decimal ?? 0,
              };
            })
            .filter((item) => item.amount !== 0n);
        });
    },
    getTokenAmount: async (tokenId: string = 'erg') => {
      if (tokenId === 'erg') {
        return BigInt(wallet.balance);
      } else {
        return BigInt(
          wallet.tokens.find((item) => item.tokenId === tokenId)?.balance ??
            '0',
        );
      }
    },
    signAndSendTx: async (tx: UnsignedGeneratedTx) => {
      if (tx.tx instanceof wasm.ReducedTransaction) {
        txSign.setReducedTx(tx.tx);
        txSign.setTx(
          tx.tx.unsigned_tx(),
          boxesToArrayBox(tx.boxes),
          tx.dataBoxes ? boxesToArrayBox(tx.dataBoxes) : [],
        );
      } else {
        txSign.setTx(
          tx.tx,
          boxesToArrayBox(tx.boxes),
          tx.dataBoxes ? boxesToArrayBox(tx.dataBoxes) : [],
        );
      }
    },
    showNotification: message.insert,
    createChangeBox: async (inputs, outputs, fee, height) => {
      const candidate = generateChangeBox(
        boxesToArrayBox(inputs),
        boxCandidatesToArrayBoxCandidate(outputs),
        fee,
        wallet.addresses[0].address,
        height,
      );
      return candidate ? [candidate] : [];
    },
  };
};
