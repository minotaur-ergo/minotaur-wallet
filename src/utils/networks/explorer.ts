import ergoExplorerClientFactory from '@rosen-clients/ergo-explorer';
import * as wasm from 'ergo-lib-wasm-browser';
import Address from '@/db/entities/Address';
import { TokenInfo } from '@/types/db';
import { JsonBI } from '../json';
import { AbstractNetwork } from './abstractNetwork';
import { BalanceInfo } from './interfaces';

// class ErgoExplorerNetworkOld extends AbstractNetwork {
//   private readonly client;
//   constructor(url: string) {
//     super();
//     this.client = ergoExplorerClientFactory(url);
//   }
//
//   protected updateForkedTxs = async (address: Address, height: number) => {
//     const txs = await BoxDbAction.getInstance().getAddressSortedTxIds(
//       address.id,
//       height - CONFIRMATION_HEIGHT,
//     );
//     for (const tx of txs) {
//       try {
//         await this.client.v1.getApiV1TransactionsP1(tx.txId);
//         return;
//       } catch (exp) {
//         await BoxDbAction.getInstance().forkTx(tx.txId);
//         console.log(exp);
//       }
//     }
//   };
//
//   protected getAddressTransactions = async (
//     address: Address,
//     toHeight: number,
//   ) => {
//     const fromHeight = address.process_height;
//     let txs: Array<V1.TransactionInfo> = [];
//     let total = 1;
//     while (txs.length < total) {
//       const txsInfoChunk = await this.client.v1.getApiV1AddressesP1Transactions(
//         address.address,
//         {
//           fromHeight,
//           offset: Math.max(txs.length - 1, 0),
//           limit: 20,
//           toHeight,
//         },
//       );
//       total = txsInfoChunk.total;
//       const txsChunk = txsInfoChunk.items ? txsInfoChunk.items : [];
//       // verify that one transaction if must exist in new collection
//       if (txs.length > 0) {
//         const oldTx = txs[txs.length - 1];
//         const newTx = txsChunk[0];
//         if (oldTx.id !== newTx.id) {
//           // fork detected during update process
//           return false;
//         }
//       }
//       txs = [...txs.slice(0, txs.length - 1), ...txsChunk];
//     }
//     for (const tx of txs) {
//       const outputs = tx.outputs ? tx.outputs : [];
//       for (let index = 0; index < outputs.length; index++) {
//         const output = outputs[index];
//         if (output.address === address.address) {
//           await BoxDbAction.getInstance().insertOrUpdateBox(
//             {
//               address: output.address,
//               boxId: output.boxId,
//               create: {
//                 index: index,
//                 tx: tx.id,
//                 height: tx.inclusionHeight,
//                 timestamp: parseInt(tx.timestamp.toString()),
//               },
//               serialized: serialize(
//                 wasm.ErgoBox.from_json(JsonBI.stringify(output)),
//               ),
//             },
//             address,
//           );
//         }
//       }
//     }
//     for (const tx of txs) {
//       const inputs = tx.inputs ? tx.inputs : [];
//       for (let index = 0; index < inputs.length; index++) {
//         const input = inputs[index];
//         await BoxDbAction.getInstance().spendBox(input.boxId, {
//           height: tx.inclusionHeight,
//           index: index,
//           tx: tx.id,
//           timestamp: parseInt(tx.timestamp.toString()),
//           blockId: tx.blockId,
//         });
//       }
//     }
//     await AddressDbAction.getInstance().updateAddressHeight(
//       address.id,
//       toHeight,
//     );
//     return true;
//   };
//
//   getBoxById = async (boxId: string): Promise<wasm.ErgoBox | undefined> => {
//     return this.client.v1.getApiV1BoxesP1(boxId).then((res) => {
//       if (res !== undefined) {
//         return wasm.ErgoBox.from_json(JsonBI.stringify(res));
//       }
//     });
//   };
//
//   syncBoxes = async (address: Address): Promise<boolean> => {
//     const height = await this.getHeight();
//     await this.updateForkedTxs(address, height);
//     return await this.getAddressTransactions(address, height);
//   };
//
//   getAddressInfo = async (address: string): Promise<BalanceInfo> => {
//     return this.client.v1
//       .getApiV1AddressesP1BalanceConfirmed(address)
//       .then((response) => ({
//         nanoErgs: response.nanoErgs,
//         tokens: response.tokens
//           ? response.tokens.map((token) => ({
//               id: token.tokenId,
//               amount: token.amount,
//             }))
//           : [],
//       }));
//   };
//
//   getAddressTransactionCount = (address: string): Promise<number> => {
//     return this.client.v1
//       .getApiV1AddressesP1Transactions(address, {
//         limit: 1,
//       })
//       .then((res) => res.total);
//   };
//
//   getAssetDetails = (assetId: string): Promise<TokenInfo> => {
//     return this.client.v1.getApiV1TokensP1(assetId).then((res) => {
//       return this.client.v1.getApiV1BoxesP1(res.boxId).then((boxInfo) => ({
//         name: res.name,
//         boxId: res.boxId,
//         id: res.id,
//         height: boxInfo.settlementHeight,
//         decimals: res.decimals,
//         description: res.description,
//         emissionAmount: res.emissionAmount,
//         txId: boxInfo.transactionId,
//       }));
//     });
//   };
//
//   getContext = async (): Promise<wasm.ErgoStateContext> => {
//     const headers = (
//       await this.client.v1.getApiV1BlocksHeaders({
//         offset: 0,
//         limit: 10,
//       })
//     ).items;
//     if (headers) {
//       const blockHeaders = wasm.BlockHeaders.from_json(
//         headers.map((item) => JsonBI.stringify(item)),
//       );
//       const pre_header = wasm.PreHeader.from_block_header(blockHeaders.get(0));
//       return new wasm.ErgoStateContext(pre_header, blockHeaders);
//     }
//     throw Error('Unknown error occurred');
//   };
//
//   getHeight = (): Promise<number> => {
//     return this.client.v1.getApiV1Networkstate().then((res) => res.height);
//   };
//
//   sendTx = (tx: wasm.Transaction): Promise<{ txId: string }> => {
//     return this.client.v1
//       .postApiV1MempoolTransactionsSubmit(tx.to_json() as never)
//       .then((txId) => ({ txId: txId.id }));
//   };
//
//   getUnspentBoxByTokenId = async (
//     tokenId: string,
//     offset: number,
//     limit: number,
//   ): Promise<Array<wasm.ErgoBox>> => {
//     return this.client.v1
//       .getApiV1BoxesUnspentBytokenidP1(tokenId, { limit, offset })
//       .then((res) => {
//         return res.items ?? ([] as Array<V1.OutputInfo>);
//       })
//       .then((elements) =>
//         elements.map((item) => wasm.ErgoBox.from_json(JsonBI.stringify(item))),
//       );
//   };
//
//   trackMempool = async (box: wasm.ErgoBox): Promise<wasm.ErgoBox> => {
//     return box;
//   };
// }

class ErgoExplorerNetwork extends AbstractNetwork {
  private readonly client;
  private static MAX_ALLOWED_TX_PER_PAGE = 256;

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
      return new wasm.ErgoStateContext(pre_header, blockHeaders);
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

  syncBoxes = async (address: Address): Promise<boolean> => {
    const height = await this.getHeight();
    const addressHeight = address.process_height;
    while (addressHeight < height) {
      // split chunk
      let toHeight = height;
      const chunk = await this.client.v1.getApiV1AddressesP1Transactions(
        address.address,
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
          console.log(block);
          // get all transactions of block
        }
      }
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
}

export default ErgoExplorerNetwork;
