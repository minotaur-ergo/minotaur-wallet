import {
  AddressDbAction,
  BlockDbAction,
  BoxContentDbAction,
  BoxDbAction,
  TxDbAction,
} from '../db';
import { getNetworkType } from '../../util/network_type';
import { Node } from '../../util/network/node';
import { HeightRange, TokenData, TxDictionary } from '../Types';
import { Paging } from '../../util/network/paging';
import Address from '../../db/entities/Address';
import { AddressInfo, ErgoTx, Items, Token } from '../../util/network/models';
import Tx, { TxStatus } from '../../db/entities/Tx';
import { Explorer } from '../../util/network/explorer';
import { validateBoxContentModel } from '../../store/asyncAction';

//constants
const LIMIT = 30 * 720; // one month
const TX_PAGE_LIMIT = 50;
const INITIAL_LIMIT = 10;

export class SyncTxs {
  private readonly address: Address;
  networkType: string;
  node: Node;
  explorer: Explorer;

  constructor(address: Address, network_type: string) {
    this.networkType = network_type;
    this.address = address;
    this.node = getNetworkType(network_type).getNode();
    this.explorer = getNetworkType(address.network_type).getExplorer();
  }

  /**
   * save extracted txs to db, insert unspent boxes and update spent boxes.
   * @param txs : TxDictionary
   * @param maxHeight : number
   */
  saveTxsToDB = async (txs: TxDictionary, maxHeight: number): Promise<void> => {
    const keyHeights = Object.keys(txs).map(Number);
    keyHeights.sort((k1, k2) => k1 - k2);
    for (const height of keyHeights) {
      if (height < maxHeight) {
        const txMap: { [txId: string]: Tx } = {};
        for (const tx of txs[height]) {
          const saved = await TxDbAction.updateOrCreateTx(
            tx,
            TxStatus.Mined,
            this.networkType
          );
          if (saved.tx) {
            txMap[tx.id] = saved.tx;
            for (const box of tx.outputs) {
              if (box.address === this.address.address) {
                await BoxDbAction.createOrUpdateBox(
                  box,
                  this.address,
                  saved.tx,
                  box.index
                );
              }
            }
          } else {
            throw new Error('Transaction not stored in database.');
          }
        }
        for (const tx of txs[height]) {
          const entity = txMap[tx.id];
          for (
            let inputIndex = 0;
            inputIndex < tx.inputs.length;
            inputIndex++
          ) {
            const input = tx.inputs[inputIndex];
            if (input.address == this.address.address) {
              await BoxDbAction.spentBox(input.boxId, entity, inputIndex);
            }
          }
        }
      }
    }
    await validateBoxContentModel();
  };

  /**
   * check blockIds of received txs and compare them with blckIds stored in database.
   * @param txDictionary: TxDictionary
   */
  checkTxValidation = async (
    txDictionary: TxDictionary
  ): Promise<number | undefined> => {
    let validHeight: number | undefined = undefined;
    let invalid = false;
    for (const height in txDictionary) {
      const header = await BlockDbAction.getBlockByHeight(
        parseInt(height),
        this.networkType
      );
      if (header) {
        txDictionary[height].forEach((tx) => {
          if (tx.blockId !== header.id) {
            invalid = true;
          }
        });
      }
      validHeight = invalid ? validHeight : parseInt(height);
    }
    return invalid ? validHeight : undefined;
  };

  /**
   * sort ErgoTxs and return a dictionary mapping each number k in txs' heightRange to array of txs with inclusionHeight == k
   * @param txs: ErgoTx[]
   * @returns TxDictionary
   */
  sortTxs = (txs: ErgoTx[]): TxDictionary => {
    const sortedTxs: TxDictionary = {};
    txs.forEach((tx) => {
      if (sortedTxs[tx.inclusionHeight] == undefined) {
        sortedTxs[tx.inclusionHeight] = [tx];
      } else {
        sortedTxs[tx.inclusionHeight] =
          sortedTxs[tx.inclusionHeight].concat(tx);
      }
    });
    return sortedTxs;
  };

  /**
   * get transactions for specific address, check if they're valid and store them.
   * @param currentHeight : number
   */
  syncTxsWithAddress = async (currentHeight: number) => {
    const lastHeight: number = await this.node.getHeight();
    const heightRange: HeightRange = {
      fromHeight: currentHeight,
      toHeight: currentHeight,
    };
    while (heightRange.fromHeight <= lastHeight) {
      const txs: ErgoTx[] = [];
      let pageTxs: Items<ErgoTx> | undefined = undefined;
      const paging: Paging = {
        limit: INITIAL_LIMIT,
        offset: 0,
      };
      while (pageTxs == undefined || pageTxs.items.length != 0) {
        pageTxs = await this.explorer.getTxsByAddressInHeightRange(
          this.address.address,
          heightRange,
          paging,
          false
        );
        txs.push(...pageTxs.items);
        paging.offset += paging.limit;
        paging.limit = TX_PAGE_LIMIT;
      }
      const sortedTxs = this.sortTxs(txs);
      const validHeight = await this.checkTxValidation(sortedTxs);
      await this.saveTxsToDB(sortedTxs, validHeight ? validHeight : lastHeight);
      await AddressDbAction.setAddressHeight(
        this.address.id,
        validHeight ? validHeight : lastHeight
      );
      if (validHeight) {
        break;
      }
      heightRange.fromHeight = heightRange.toHeight + 1;
      heightRange.toHeight = Math.min(lastHeight, heightRange.toHeight + LIMIT);
      paging.offset = 0;
    }
  };

  verifyContent = async (expected: AddressInfo): Promise<boolean> => {
    return (
      (await this.verifyTokens(expected.tokens)) &&
      (await this.verifyTotalErg(expected.nanoErgs))
    );
  };

  /**
   * compare dbTokens of the address with expectedTokens given from explorer.
   * @param expectedTokens : Token[]
   * @returns
   */
  verifyTokens = async (expectedTokens: Token[]): Promise<boolean> => {
    const dbTokens: TokenData[] = await BoxContentDbAction.getAddressTokens(
      this.address.id
    );
    const isSameToken = (a: TokenData, b: Token) =>
      a.tokenId === b.tokenId && a.total === b.amount;
    const diff1 = dbTokens.filter(
      (dbToken) =>
        !expectedTokens.some((expectedToken) =>
          isSameToken(dbToken, expectedToken)
        )
    );

    const diff2 = expectedTokens.filter(
      (expectedToken) =>
        !dbTokens.some((dbToken) => isSameToken(dbToken, expectedToken))
    );

    return diff1.length == 0 && diff2.length == 0;
  };

  verifyTotalErg = async (expectedTotalErg: bigint) => {
    const totalDbErg = await AddressDbAction.getAddressTotalErg(
      this.address.id
    );
    return totalDbErg?.erg_str == expectedTotalErg;
  };
}
