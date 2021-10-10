import React from "react";
import { Divider, List } from "@material-ui/core";
import TransactionElement from "./TransactionElement";

const transactions = [
    {"id": "1", "time": "1631682089", "type": "in", "amount": {"erg": 1000000000, "SigUSD": 1900}},
    {"id": "1", "time": "1631682089", "type": "out", "amount": {"erg": 1200000000, "SigUSD": 1900}},
]
class TransactionTab extends React.Component {
    render = () => {
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
}

export default TransactionTab;
