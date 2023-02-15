import { SyncTxs } from './txs';
import { SyncBlock } from './block';
import { AddressDbAction, BlockDbAction, DbTransaction } from '../db';
import { Block } from '../Types';
import Address from '../../db/entities/Address';
import { getNetworkType } from '../../util/network_type';
import { VerifyAddress } from './verify';
import { CONFIRMATION_HEIGHT } from '../../util/const';

/**
 * Sync Process: sync given address and its network_type.
 * @param address: Address
 */
export const syncAddress = async (address: Address) => {
  const syncBlocks = new SyncBlock(address.network_type);

  const currentHeight = address.process_height;

  const syncTxs = new SyncTxs(address);

  try {
    const forkPoint = await syncBlocks.update();
    if (forkPoint !== undefined) {
      await DbTransaction.forkAll(forkPoint, address.network_type);
      await AddressDbAction.setAddressHeight(address.id, forkPoint);
    } else {
      await syncTxs.syncTxsWithAddress(currentHeight + 1);
      await BlockDbAction.removeOldHeaders(
        currentHeight - CONFIRMATION_HEIGHT,
        address.network_type
      );
    }
  } catch (e) {
    console.error(e);
  }
};

export const VerifyAddressContent = async (addressId: number) => {
  const address = await AddressDbAction.getAddress(addressId);
  if (address) {
    const network_type = getNetworkType(address.network_type);
    const explorer = network_type.getExplorer();
    const node = network_type.getNode();
    const expected = await explorer.getConfirmedBalanceByAddress(
      address.address
    );
    const lastReceivedBlock: Block = await node.getLastBlockHeader();
    if (lastReceivedBlock.height === address.process_height) {
      const lastDbBlockHeader = (
        await BlockDbAction.getLastHeaders(address.network_type, 1)
      )?.pop();
      const verify = new VerifyAddress(address);
      const successfullySynced = await verify.verifyContent(expected);
      if (!successfullySynced && lastDbBlockHeader) {
        if (
          lastDbBlockHeader.id == lastReceivedBlock.id &&
          lastReceivedBlock.height == lastReceivedBlock.height &&
          address &&
          address.process_height == lastReceivedBlock.height
        ) {
          return false;
        }
      }
    }
  }
  return true;
};
