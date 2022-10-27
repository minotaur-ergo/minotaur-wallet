import { SyncTxs } from './SyncTxs';
import { SyncBlocks } from './SyncBlocks';
import { AddressDbAction, BlockDbAction } from '../db';
import { Block, Err } from './../Types';

/**
 * Sync Process: sync blocks of address 's network and then sync the transactions.
 * @param walletId : number
 */
export const sync = async (walletId: number) => {
  const allAddresses = await AddressDbAction.getWalletAddresses(walletId);
  for (const address of allAddresses) {
    const currentHeight = address.process_height;
    const networkType = address.network_type;

    const syncBlocks = new SyncBlocks(networkType);
    const syncTxs = new SyncTxs(address, networkType);
    const startBlock = await BlockDbAction.getBlockByHeight(
      address.process_height,
      address.network_type
    );
    const lastBlock = (await BlockDbAction.getLastHeaders(1)).pop()!;
    const lastDbBlockHeader: Block = {
      height: lastBlock.height,
      id: lastBlock.block_id,
    };

    try {
      const forkMsg = await syncBlocks.update(address.process_height);
      if (forkMsg !== undefined) {
        await syncTxs.forkTxs(forkMsg.data);
      }
      await syncTxs.syncTrxsWithAddress(currentHeight);
    } catch {
      /* empty */
    }

    const successfullySynced = await syncTxs.verifyContent();
    if (!successfullySynced) {
      const lastRecievedBlock: Block = await syncTxs.node.getLastBlockHeader();
      if (lastDbBlockHeader == lastRecievedBlock)
        AddressDbAction.setAddressHeight(address.id, startBlock!.height);
    }
  }
};
