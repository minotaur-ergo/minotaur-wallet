import { SyncTxs } from './SyncTxs';
import { SyncBlocks } from './SyncBlocks';
import { AddressDbAction, BlockDbAction, DbTransaction } from '../db';
import { Block } from './../Types';

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

    try {
      const forkPoint = await syncBlocks.update();
      if (forkPoint !== undefined) {
        await DbTransaction.forkAll(forkPoint, address.network_type);
        AddressDbAction.setAddressHeight(address.id, forkPoint);
      }
      await syncTxs.syncTrxsWithAddress(currentHeight);
    } catch {
      /* empty */
    }

    const lastRecievedBlock: Block = await syncTxs.node.getLastBlockHeader();
    const lastDbBlockHeader = (await BlockDbAction.getLastHeaders(1))!.pop();
    const successfullySynced = await syncTxs.verifyContent();
    if (!successfullySynced) {
      if (lastDbBlockHeader == lastRecievedBlock)
        AddressDbAction.setAddressHeight(address.id, 0);
      await DbTransaction.forkAddress(address);
    }
  }
};
