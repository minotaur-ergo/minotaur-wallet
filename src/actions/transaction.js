
import JSONBI from "json-bigint"

import Explorer from "../network/Explorer";
import { insertTransaction, prune } from "../db/commands/transaction";
import { getAllAddressesExceptCold, getWalletAddresses } from "../db/commands/address";
import { mapAssets } from "../db/commands/asset";
import { addBox, spentBox } from "../db/commands/box";
import { getTransaction } from "../db/commands/transaction";

const explorer = new Explorer("https://api-testnet.ergoplatform.com");
const pageLimit = 50;

const getAddressTransactions = async (fromHeight, address) => {
  let all_transactions = [];
  let offset = 0;
  while (true){
    let transactions = await explorer.getTxsByAddress(address, offset, pageLimit);
    all_transactions = all_transactions.concat(transactions)
    if(transactions.length === 0){
      break;
    }
    offset += pageLimit;
  }
  return all_transactions
}


/*
* 1- get all addresses except cold wallet addresses ---
* 2- fetch transaction for each address    -----
* 3- insert transactions into database     -----
* 4- iterate over all assets in all output boxes which does not exists in db
* 5- insert them into database
* 6- insert output box into database
*   6.1 insert assets in each boxes
* 7- process input box of transactions
* 8- update status of all mempool transactions to deleted
* 9- process mempool transactions. same as above except transactions marked as mempool
* 10- delete all transaction with deleted status
* */

export const getTransactions = async () => {
  (await getAllAddressesExceptCold()).forEach(elem => {
    getAndProcessTransactionForAddress(elem.id, elem.address, elem.last_height)
  });
}

const getAndProcessTransactionForAddress = async (address_id, address, last_height) => {
  const transactions = await getAddressTransactions(last_height, address)

  for(let tx of transactions){
    await insertTransaction(tx.id, tx.inclusionHeight, tx.timestamp, tx)
  }
  // const asset_map = await mapAssets();
  let outputs = []
  transactions.forEach(tx => {
    const tx_out = tx.outputs.filter(output => output.address === address);
    if(tx_out.length > 0) {
      outputs = outputs.concat(tx_out)
    }
  });
  for(let output of outputs){
    const tx = await getTransaction(output.transactionId)
    await addBox(tx.id, address_id, output.index, output);
    // TODO process assets of this box
  }
  transactions.forEach(tx => {
    const transaction = getTransaction(tx.id);
    tx.inputs.forEach(async (input, index) => {
      if(input.address === address) {
        await spentBox(input.box_id, transaction.id, index);
      }
    })
  })
}

export const startupService = async() => {
  try{
    await getTransactions();
  }catch (e){
    console.log("get transaction error is ", e)
  }
  setTimeout(startupService, 30*1000);
}
