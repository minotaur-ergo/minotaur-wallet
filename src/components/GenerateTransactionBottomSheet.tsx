import React from "react";
import BottomSheet from "./bottom-sheet/BottomSheet";
import Wallet from "../db/entities/Wallet";
import { UnsignedGeneratedTx } from "../utils/interface";
import { getWalletAddresses } from "../action/address";
import UnsignedTxView from "./display-tx/UnsignedTxView";
import * as wasm from "ergo-lib-wasm-browser";
import { Divider } from "@material-ui/core";
import Loading from "./Loading";
import SignTransactionDisplay from "./SignTransactionDisplay";

interface PropsType {
    transaction?: UnsignedGeneratedTx
    show: boolean;
    close: () => any;
    wallet: Wallet;
}

interface StateType {
    addresses: Array<string>;
    loaded_wallet_id: number;
    loading: boolean;
}

class GenerateTransactionBottomSheet extends React.Component<PropsType, StateType> {
    state = {
        addresses: [],
        loaded_wallet_id: -1,
        loading: false
    };

    loadAddresses = () => {
        if (!this.state.loading && this.props.wallet.id !== this.state.loaded_wallet_id) {
            const wallet_id = this.props.wallet.id;
            this.setState({ loading: true });
            getWalletAddresses(wallet_id).then(addresses => {
                const address_array = addresses.map(item => item.address);
                this.setState({
                    loaded_wallet_id: wallet_id,
                    addresses: address_array,
                    loading: false
                });
            });
        }
    };

    componentDidUpdate = () => {
        this.loadAddresses();
    };

    componentDidMount = () => {
        this.loadAddresses();
    };

    render_transaction = () => {
        if (this.state.loaded_wallet_id === this.props.wallet.id && this.props.transaction && this.props.transaction.tx && this.props.transaction.boxes) {
            const tx = this.props.transaction.tx;
            const unsigned_tx = tx.hasOwnProperty("unsigned_tx") ? (tx as wasm.ReducedTransaction).unsigned_tx() : tx as wasm.UnsignedTransaction;
            const boxes = this.props.transaction.boxes;
            const box_array = Array(boxes.len()).map((item, index) => boxes.get(index));
            return (
                <UnsignedTxView
                    network_type={this.props.wallet.network_type}
                    tx={unsigned_tx}
                    boxes={box_array}
                    addresses={this.state.addresses}
                />
            );
        } else {
            return <Loading />;
        }
    };

    render = () => {
        return (
            <BottomSheet show={this.props.show} close={this.props.close}>
                {this.render_transaction()}
                <Divider />
                <SignTransactionDisplay
                    wallet={this.props.wallet}
                    show={this.props.show}
                    close={this.props.close}
                    transaction={this.props.transaction} />
            </BottomSheet>
        );
    };
}

export default GenerateTransactionBottomSheet;
