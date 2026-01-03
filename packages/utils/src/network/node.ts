import { CapacitorHttp } from '@capacitor/core';
import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  AbstractNetwork,
  BalanceInfo,
  BoxInfo,
  SpendDetail,
  TokenInfo,
} from '@minotaur-ergo/types';
import { ItemsTransactionInfo } from '@rosen-clients/ergo-explorer/dist/v1/types';

import { JsonBI } from '../json';
import ErgoExplorerNetwork from './explorer';

class ErgoNodeNetwork extends AbstractNetwork {
  private nodeUrl: string;
  private ergoExplorerNetwork: ErgoExplorerNetwork;
  private static MAX_ALLOWED_TX_PER_PAGE = 100;

  constructor(url: string, node: string) {
    super();
    this.nodeUrl = node.replace(/\/$/, '');
    this.ergoExplorerNetwork = new ErgoExplorerNetwork(url.replace(/\/$/, ''));
  }

  getHeight = async (): Promise<number> => {
    const res = await CapacitorHttp.get({
      url: `${this.nodeUrl}/blockchain/indexedHeight`,
    });
    return res.data.fullHeight;
  };

  getAddressTransactionCount = async (address: string): Promise<number> => {
    const date = await this.getAddressTransactions(address, 1, 0);
    return date.total;
  };

  getContext = async (): Promise<wasm.ErgoStateContext> => {
    const headers = await CapacitorHttp.get({
      url: `${this.nodeUrl}/blocks/lastHeaders/10`,
    }).then((res) => res.data.reverse());
    if (headers) {
      const blockHeaders = wasm.BlockHeaders.from_json(
        headers.map((item: wasm.BlockHeader) => JsonBI.stringify(item)),
      );
      const pre_header = wasm.PreHeader.from_block_header(blockHeaders.get(0));
      return new wasm.ErgoStateContext(
        pre_header,
        blockHeaders,
        wasm.Parameters.default_parameters(),
      );
    }
    throw Error('Unknown error occurred');
  };

  sendTx = async (tx: wasm.Transaction): Promise<{ txId: string }> => {
    const res = await CapacitorHttp.post({
      url: `${this.nodeUrl}/transactions`,
      data: tx.to_json(),
    });
    return { txId: res.data.id };
  };

  getAddressInfo = async (address: string): Promise<BalanceInfo> => {
    const res = await CapacitorHttp.post({
      url: `${this.nodeUrl}/blockchain/balance`,
      data: address,
    });
    return {
      nanoErgs: BigInt(res.data.confirmed.nanoErgs),
      tokens: res.data.confirmed.tokens.map(
        (item: { tokenId: string; amount: number }) => ({
          id: item.tokenId,
          amount: item.amount,
        }),
      ),
    };
  };

  getAssetDetails = async (assetId: string): Promise<TokenInfo> => {
    return this.ergoExplorerNetwork.getAssetDetails(assetId);
  };

  getBoxById = async (boxId: string): Promise<wasm.ErgoBox | undefined> => {
    return this.ergoExplorerNetwork.getBoxById(boxId);
  };

  getAddressTransactions = async (
    address: string,
    limit: number,
    offset: number,
  ): Promise<ItemsTransactionInfo> => {
    const res = await CapacitorHttp.post({
      url: `${this.nodeUrl}/blockchain/transaction/byAddress?offset=${offset}&limit=${limit}`,
      data: address,
    });
    return res.data;
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
          await this.ergoExplorerNetwork.processTransactionOutput(
            tx,
            address,
            insertOrUpdateBox,
          );
        }
        // add input boxes = spent boxes
        for (const tx of chunk.items ?? []) {
          await this.ergoExplorerNetwork.processTransactionInput(
            tx,
            address,
            spendBox,
          );
        }
      } while (chunk.total > offset);

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
    return this.ergoExplorerNetwork.getUnspentBoxByTokenId(
      tokenId,
      offset,
      limit,
    );
  };

  trackMempool = async (box: wasm.ErgoBox): Promise<wasm.ErgoBox> => {
    return this.ergoExplorerNetwork.trackMempool(box);
  };

  getTransaction = async (
    txId: string,
  ): Promise<{
    tx?: wasm.Transaction;
    date: string;
    boxes: Array<wasm.ErgoBox>;
  }> => {
    return this.ergoExplorerNetwork.getTransaction(txId);
  };
}

export { ErgoNodeNetwork as default };
