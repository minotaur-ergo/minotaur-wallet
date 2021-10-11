import Explorer from "../network/Explorer";

const explorer = new Explorer("https://api-testnet.ergoplatform.com")

const loadWalletTransaction = async () => {
  let all_transactions = [];
    let transactions = explorer.getUnspentByAddress()
}
