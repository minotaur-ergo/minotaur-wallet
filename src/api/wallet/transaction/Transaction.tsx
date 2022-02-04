import React from "react";
import { Divider, List } from "@material-ui/core";
import TransactionElement from "./TransactionElement";
import { getWalletTx } from "../../../db/action/transaction";
import WalletTx from "../../../db/entities/views/WalletTx";
import { WalletPagePropsType } from "../WalletPage";
import * as wasm from "ergo-lib-wasm-browser";
import TxBoxDisplay from "../../../components/display-tx/TxBoxDisplay";
import { InputBox } from "../../../network/models";
import { JsonAllBI, JsonBI } from "../../../config/json";

interface StateType {
    transactions: Array<WalletTx>;
    addressValid: boolean;
    displayTx: boolean;
    inputs: Array<InputBox>;
    outputs: Array<wasm.ErgoBox>;
}

class Transaction extends React.Component<WalletPagePropsType, StateType> {
    state: StateType = {
        transactions: [],
        addressValid: false,
        displayTx: false,
        inputs: [],
        outputs: []
    };

    loadTransactions = () => {
        if (!this.state.addressValid) {
            getWalletTx(this.props.wallet.id).then(dbTransaction => {
                this.setState({
                    transactions: dbTransaction,
                    addressValid: true
                });
            });
        }
    };

    selectTransaction = (index: number) => {
        if (index < this.state.transactions.length && index >= 0) {
            const txJson = JsonAllBI.parse(this.state.transactions[index].json);
            const inputs = txJson.inputs as Array<InputBox>;
            const outputs = txJson.outputs.map((item: any) => wasm.ErgoBox.from_json(JsonAllBI.stringify(item)));
            this.setState({
                displayTx: true,
                inputs: inputs,
                outputs: outputs
            });
        }
    };

    componentDidUpdate = () => {
        this.loadTransactions();
    };

    componentDidMount = () => {
        this.loadTransactions();
        this.props.setTab("transaction");
    };

    render = () => {
        return (
            <React.Fragment>
                <List>
                    {this.state.transactions.map((transaction: WalletTx, index: number) => (
                        <React.Fragment key={transaction.id}>
                            <TransactionElement transaction={transaction}
                                                handleClick={() => this.selectTransaction(index)} />
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <TxBoxDisplay
                    show={this.state.displayTx}
                    inputsJs={this.state.inputs}
                    close={() => this.setState({ displayTx: false })}
                    outputs={this.state.outputs}
                />

            </React.Fragment>
        );
    };
}

export default Transaction;
