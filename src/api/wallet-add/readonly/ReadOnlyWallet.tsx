import React from "react";
import WalletCreate from "../WalletCreate";
import WalletName from "../WalletName";
import { withRouter } from "react-router-dom";
import ReadOnlyWalletAddress from "./ReadOnlyWalletAddress";
import * as walletActions from '../../../action/wallet';

class ReadOnlyWallet extends WalletCreate {
    steps = [
        "Name",
        "Address"
    ];
    renderName = () => (
        <WalletName
            hidePassword={true}
            hideDbPassword={true}
            name={this.state.name}
            goBack={this.props.back}
            goForward={(name, password) => this.gotoMnemonic(name, password)}>
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
