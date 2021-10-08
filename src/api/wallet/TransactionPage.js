import React from "react";
import { Divider, List } from "@material-ui/core";
import InWalletPage from "../../hoc/InWalletPage";
import TransactionElement from "./TransactionElement";

const transactions = [
    {"id": "1", "time": "1631682089", "type": "in", "amount": {"erg": 1000000000, "SigUSD": 1900}},
    {"id": "1", "time": "1631682089", "type": "out", "amount": {"erg": 1200000000, "SigUSD": 1900}},
]
class TransactionPage extends React.Component {
    render = () => {
        return (
            <List>
                {transactions.map(wallet => (
                    <React.Fragment key={wallet.id}>
                        <TransactionElement {...wallet}/>
                        <Divider/>
                    </React.Fragment>
                ))}
            </List>
        )
    }
}

export default InWalletPage(TransactionPage);
