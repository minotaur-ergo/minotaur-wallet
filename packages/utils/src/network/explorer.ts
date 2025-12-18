import { CapacitorHttp } from '@capacitor/core';
import * as wasm from '@minotaur-ergo/ergo-lib';
import {
  AbstractNetwork,
  BalanceInfo,
  BoxInfo,
  SpendDetail,
  TokenInfo,
} from '@minotaur-ergo/types';
import ergoExplorerClientFactory, { V1 } from '@rosen-clients/ergo-explorer';
import { ItemsTransactionInfo } from '@rosen-clients/ergo-explorer/dist/v1/types';
import JSONBigInt from 'json-bigint';

import { JsonBI } from '../json';
import { serializeBox } from '../wasm';

const getBoxId = (box: { boxId: string } | { id: string }) => {
  if (Object.prototype.hasOwnProperty.call(box, 'boxId'))
    return (box as { boxId: string }).boxId;
  return (box as { id: string }).id;
};

class ErgoExplorerNetwork extends AbstractNetwork {
  private readonly client;
  static MAX_ALLOWED_TX_PER_PAGE = 100;

  constructor(url: string) {
    super();
    this.client = ergoExplorerClientFactory(url);
  }

  getHeight = async (): Promise<number> => {
    const info = await this.client.v1.getApiV1Info();
    return info.height;
  };

  getAddressTransactionCount = async (address: string): Promise<number> => {
    const data = await this.client.v1.getApiV1AddressesP1Transactions(address, {
      limit: 1,
    });
    return data.total;
  };

  getContext = async (): Promise<wasm.ErgoStateContext> => {
    const headers = (
      await this.client.v1.getApiV1BlocksHeaders({
        offset: 0,
        limit: 10,
      })
    ).items;
    if (headers) {
      const blockHeaders = wasm.BlockHeaders.from_json(
        headers.map((item) => JsonBI.stringify(item)),
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
    const res = await this.client.v1.postApiV1MempoolTransactionsSubmit(
      tx.to_json() as never,
    );
    return { txId: res.id };
  };

  getAddressInfo = async (address: string): Promise<BalanceInfo> => {
    const res =
      await this.client.v1.getApiV1AddressesP1BalanceConfirmed(address);
    return {
      nanoErgs: res.nanoErgs,
      tokens: res.tokens
        ? res.tokens.map((item) => ({ id: item.tokenId, amount: item.amount }))
        : [],
    };
  };

  getAssetDetails = async (assetId: string): Promise<TokenInfo> => {
    const tokenInfo = await this.client.v1.getApiV1TokensP1(assetId);
    const boxInfo = await this.client.v1.getApiV1BoxesP1(tokenInfo.boxId);
    return {
      name: tokenInfo.name,
      boxId: tokenInfo.boxId,
      id: tokenInfo.id,
      height: boxInfo.settlementHeight,
      decimals: tokenInfo.decimals,
      description: tokenInfo.description,
      emissionAmount: tokenInfo.emissionAmount,
      txId: boxInfo.transactionId,
    };
  };

  getBoxById = async (boxId: string): Promise<wasm.ErgoBox | undefined> => {
    const boxInfo = await this.client.v1.getApiV1BoxesP1(boxId);
    if (boxInfo !== undefined) {
      return wasm.ErgoBox.from_json(JsonBI.stringify(boxInfo));
    }
  };

  processTransactionInput = async (
    tx: V1.TransactionInfo | V1.TransactionInfo1,
    address: string,
    spendBox: (boxId: string, details: SpendDetail) => Promise<unknown>,
  ) => {
    for (const input of tx.inputs ?? []) {
      if (input.address === address) {
        await spendBox(getBoxId(input), {
          height: tx.inclusionHeight,
          timestamp: parseInt(tx.timestamp.toString()),
          tx: tx.id,
          index: input.index,
        });
      }
    }
  };

  processTransactionOutput = async (
    tx: V1.TransactionInfo | V1.TransactionInfo1,
    address: string,
    insertOrUpdateBox: (box: BoxInfo) => Promise<unknown>,
  ) => {
    for (const output of tx.outputs ?? []) {
      if (output.address === address) {
        await insertOrUpdateBox({
          address: output.address,
          boxId: getBoxId(output),
          create: {
            index: output.index,
            tx: tx.id,
            height: tx.inclusionHeight,
            timestamp: parseInt(tx.timestamp.toString()),
          },
          serialized: serializeBox(
            wasm.ErgoBox.from_json(JsonBI.stringify(output)),
          ),
        });
      }
    }
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
      let toHeight = height;
      const proceedToHeight = async (proceedHeight: number) => {
        await updateAddressHeight(proceedHeight);
        addressHeight = proceedHeight;
        toHeight = height;
      };
      while (addressHeight < height) {
        let chunk = await this.client.v1.getApiV1AddressesP1Transactions(
          address,
          {
            limit: 1,
            offset: 0,
            fromHeight: addressHeight,
            toHeight: toHeight,
          },
        );
        if (chunk.total > ErgoExplorerNetwork.MAX_ALLOWED_TX_PER_PAGE) {
          if (toHeight > addressHeight + 1) {
            toHeight = Math.floor((toHeight + addressHeight) / 2);
          } else {
            const header = await this.client.v1.getApiV1BlocksHeaders({
              offset: addressHeight,
              limit: 1,
              sortBy: 'height',
              sortDirection: 'asc',
            });
            if (header.items === undefined) return false;
            const block = await this.client.v1.getApiV1BlocksP1(
              header.items[0].id,
            );
            for (const tx of block.block.blockTransactions ?? []) {
              await this.processTransactionOutput(
                tx,
                address,
                insertOrUpdateBox,
              );
            }
            for (const tx of block.block.blockTransactions ?? []) {
              await this.processTransactionInput(tx, address, spendBox);
            }
            await proceedToHeight(toHeight);
          }
        } else {
          if (chunk.total > 1) {
            chunk = await this.client.v1.getApiV1AddressesP1Transactions(
              address,
              {
                limit: ErgoExplorerNetwork.MAX_ALLOWED_TX_PER_PAGE,
                offset: 0,
                fromHeight: addressHeight,
                toHeight: toHeight,
              },
            );
          }
          for (const tx of chunk.items ?? []) {
            await this.processTransactionOutput(tx, address, insertOrUpdateBox);
          }
          for (const tx of chunk.items ?? []) {
            await this.processTransactionInput(tx, address, spendBox);
          }
          await proceedToHeight(toHeight);
        }
      }
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
    const boxes = await this.client.v1.getApiV1BoxesUnspentBytokenidP1(
      tokenId,
      { offset, limit },
    );
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
      const res = await this.client.v1.getApiV1TransactionsP1(txId);
      if (res === undefined) return { date: '', boxes: [] };
      const boxes = (res.inputs || []).map((box) => {
        const boxJson = {
          creationHeight: box.outputCreatedAt,
          transactionId: box.outputTransactionId,
          boxId: box.boxId,
          value: box.value,
          index: box.outputIndex,
          ergoTree: box.ergoTree,
          assets: box.assets,
          additionalRegisters: box.additionalRegisters,
        };
        return wasm.ErgoBox.from_json(JsonBI.stringify(boxJson));
      });
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

class ErgoNodeNetwork extends AbstractNetwork {
  private nodeUrl: string;
  private ergoExplorerNetwork: ErgoExplorerNetwork;

  constructor(url: string, node: string) {
    super();
    this.nodeUrl = node;
    this.ergoExplorerNetwork = new ErgoExplorerNetwork(url);
  }

  getHeight = async (): Promise<number> => {
    const res = await CapacitorHttp.get({
      url: `http://213.239.193.208:9053/blockchain/indexedHeight`,
    });
    return res.data.fullHeight;
  };

  getAddressTransactionCount = async (address: string): Promise<number> => {
    const date = await this.getAddressTransactions(address, 1, 0);
    return date.total;
  };

  getContext = async (): Promise<wasm.ErgoStateContext> => {
    return this.ergoExplorerNetwork.getContext();
  };

  sendTx = async (tx: wasm.Transaction): Promise<{ txId: string }> => {
    return this.ergoExplorerNetwork.sendTx(tx);
  };

  getAddressInfo = async (address: string): Promise<BalanceInfo> => {
    const res = await CapacitorHttp.post({
      url: `http://213.239.193.208:9053/blockchain/balance`,
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
      url: `http://213.239.193.208:9053/blockchain/transaction/byAddress?offset=${offset}&limit=${limit}`,
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
          ErgoExplorerNetwork.MAX_ALLOWED_TX_PER_PAGE,
          offset,
        );
        offset += ErgoExplorerNetwork.MAX_ALLOWED_TX_PER_PAGE;
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
      } while (chunk.total > 100);

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

export { ErgoExplorerNetwork as default, ErgoNodeNetwork };
