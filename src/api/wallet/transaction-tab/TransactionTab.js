import React, { useEffect, useState } from "react";
import { Divider, List } from "@material-ui/core";
import TransactionElement from "./TransactionElement";
import { getWalletTransactions } from "../../../db/commands/transaction";
import WithWallet from "../../../hoc/WithWallet";


const TransactionTab = props => {
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    getWalletTransactions(props.wallet.id).then(txs => setTransactions(txs))
  }, [])
  return (
    <List>
      {transactions.map(transaction => (
        <React.Fragment key={transaction.id}>
          <TransactionElement {...transaction}/>
          <Divider/>
        </React.Fragment>
      ))}
    </List>
  )
}


export default WithWallet(TransactionTab);
