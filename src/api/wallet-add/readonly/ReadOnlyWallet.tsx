import React from "react";
import WalletCreate from "../WalletCreate";
import WalletName from "../elements/WalletName";
import { withRouter } from "react-router-dom";
import ReadOnlyWalletAddress from "./ReadOnlyWalletAddress";
import * as walletActions from '../../../action/wallet';
import { show_notification } from "../../../utils/utils";

class ReadOnlyWallet extends WalletCreate {
    steps = [
        "Name",
        "Address"
    ];
    renderName = () => (
        <WalletName
            name={this.state.name}
            goBack={this.props.back}
            goForward={(name) => this.gotoMnemonic(name)}>
            <>
                Enter new wallet name.
                <p style={{ color: "red" }}>
                    This wallet is read only and to sign transactions you must use a cold wallet.
                </p>
            </>
        </WalletName>
    );

    saveWallet = () => {
        if (!this.state.saving) {
            this.setState({ saving: true });
            walletActions.createReadOnlyWallet(this.state.name, this.state.mnemonic, this.state.network_type).then(() => {
                this.props.history.goBack();
                this.setState({ saving: false });
            }).catch(exp => {
                show_notification(exp)
            });
        }
    };


    renderMnemonic = () => (
        <ReadOnlyWalletAddress
            address={this.state.mnemonic}
            network={this.state.network_type}
            setAddress={address => this.setState({ mnemonic: address })}
            setNetwork={network => this.setState({network_type: network})}
            goBack={() => this.goBackName()}
            goForward={() => this.saveWallet()} />
    );
}

export default withRouter(ReadOnlyWallet);
