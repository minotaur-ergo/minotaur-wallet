import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  BalanceInfo,
  BoxInfo,
  SpendDetail,
  TokenInfo,
} from '@minotaur-ergo/types';
import ergoNodeClientFactory from '@rosen-clients/ergo-node';
import JSONBigInt from 'json-bigint';

import { JsonBI } from '../json';
import { BaseNetwork } from './baseNetwork';
import { processTransactionInput, processTransactionOutput } from './process';

class ErgoNodeNetwork extends BaseNetwork {
  private readonly client;
  private static MAX_ALLOWED_TX_PER_PAGE = 100;

  constructor(url: string) {
    super();
    this.client = ergoNodeClientFactory(url);
  }

  getHeight = async (): Promise<number> => {
    return this.client.getNodeInfo().then((res) => res.fullHeight ?? 0);
  };

  getAddressTransactionCount = async (address: string): Promise<number> => {
    const date = await this.getAddressTransactions(address, 1, 0);
    return date.total ?? 0;
  };

  getLastHeaders = (count: number) => {
    return this.client.getLastHeaders(count);
  };

  sendTx = async (tx: wasm.Transaction): Promise<{ txId: string }> => {
    const txHex = Buffer.from(tx.sigma_serialize_bytes()).toString('hex');
    const res = await this.client.sendTransactionAsBytes(txHex);
    return { txId: res };
  };

  getAddressInfo = async (address: string): Promise<BalanceInfo> => {
    const res = (await this.client.getAddressBalanceTotal(address)).confirmed;
    if (!res) return { nanoErgs: 0n, tokens: [] };
    return {
      nanoErgs: BigInt(res.nanoErgs),
      tokens: res.tokens.map((item) => ({
        id: item.tokenId!,
        amount: item.amount!,
      })),
    };
  };

  getAssetDetails = async (assetId: string): Promise<TokenInfo> => {
    const tokenInfo = await this.client.getTokenById(assetId);
    const boxInfo = await this.client.getIndexedBoxById(tokenInfo.boxId);
    return {
      name: tokenInfo.name,
      boxId: tokenInfo.boxId,
      id: tokenInfo.id,
      height: boxInfo.inclusionHeight,
      decimals: tokenInfo.decimals,
      description: tokenInfo.description,
      emissionAmount: tokenInfo.emissionAmount,
      txId: boxInfo.transactionId,
    };
  };

  getBoxById = async (boxId: string): Promise<wasm.ErgoBox | undefined> => {
    const boxInfo = await this.client.getBoxById(boxId);
    if (boxInfo !== undefined) {
      return wasm.ErgoBox.from_json(JsonBI.stringify(boxInfo));
    }
  };

  getAddressTransactions = async (
    address: string,
    limit: number,
    offset: number,
  ) => {
    return await this.client.getTxsByAddress(address, { offset, limit });
  };

  syncBoxes = async (
    address: string,
    addressHeight: number,
    updateAddressHeight: (height: number) => Promise<unknown>,
    insertOrUpdateBox: (box: BoxInfo) => Promise<unknown>,
    spendBox: (boxId: string, details: SpendDetail) => Promise<unknown>,
  ): Promise<boolean> => {
    try {
      const height = await this.getHeight();
      const proceedToHeight = async () => {
        await updateAddressHeight(height);
      };
      if (addressHeight >= height) {
        return true;
      }
      // fetch transactions from node
      let chunk = null;
      let offset = 0;
      do {
        chunk = await this.getAddressTransactions(
          address,
          ErgoNodeNetwork.MAX_ALLOWED_TX_PER_PAGE,
          offset,
        );
        offset += ErgoNodeNetwork.MAX_ALLOWED_TX_PER_PAGE;
        // add output boxes
        for (const tx of chunk.items ?? []) {
          await processTransactionOutput(tx, address, insertOrUpdateBox);
        }
        // add input boxes = spent boxes
        for (const tx of chunk.items ?? []) {
          await processTransactionInput(tx, address, spendBox);
        }
      } while ((chunk.total ?? 0) > offset);

      // update height
      await proceedToHeight();
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  };

  getUnspentBoxByTokenId = async (
    tokenId: string,
    offset: number,
    limit: number,
  ): Promise<Array<wasm.ErgoBox>> => {
    const boxes = await this.client.getBoxesByTokenId(tokenId, {
      offset,
      limit,
    });
    if (boxes.items !== undefined) {
      return boxes.items.map((item) =>
        wasm.ErgoBox.from_json(JsonBI.stringify(item)),
      );
    }
    return [];
  };

  trackMempool = async (box: wasm.ErgoBox): Promise<wasm.ErgoBox> => {
    return box;
  };

  getTransaction = async (
    txId: string,
  ): Promise<{
    tx?: wasm.Transaction;
    date: string;
    boxes: Array<wasm.ErgoBox>;
  }> => {
    try {
      const res = await this.client.getTxById(txId);
      if (res === undefined) return { date: '', boxes: [] };
      const boxes = (res.inputs || []).map((box) =>
        wasm.ErgoBox.from_json(JsonBI.stringify(box)),
      );
      const txJson = {
        id: res.id,
        inputs: (res.inputs ?? []).map((item) => ({
          boxId: item.boxId,
          spendingProof: {
            proofBytes: item.spendingProof ? item.spendingProof : '',
            extension: {},
          },
        })),
        dataInputs: res.dataInputs,
        outputs: res.outputs,
      };
      const date = new Date(parseInt(res.timestamp.toString()));
      return {
        tx: wasm.Transaction.from_json(JSONBigInt.stringify(txJson)),
        date: date.toDateString() + ', ' + date.toLocaleTimeString(),
        boxes: boxes,
      };
    } catch (e) {
      console.error(e);
      return { date: '', boxes: [] };
    }
  };
}

export { ErgoNodeNetwork as default };
