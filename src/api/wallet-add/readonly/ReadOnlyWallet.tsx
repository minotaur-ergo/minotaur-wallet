import React from "react";
import WalletCreate from "../WalletCreate";
import WalletName from "../elements/WalletName";
import { withRouter } from "react-router-dom";
import ReadOnlyWalletAddress from "./ReadOnlyWalletAddress";
import * as walletActions from '../../../action/wallet';
import { is_valid_address, is_valid_extended_public_key, show_notification } from "../../../utils/utils";

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
            if(is_valid_address(this.state.mnemonic)) {
                walletActions.createReadOnlyWallet(this.state.name, this.state.mnemonic, this.state.network_type).then(() => {
                    this.props.history.goBack();
                    this.setState({ saving: false });
                }).catch(exp => {
                    show_notification(exp)
                });
            }else if(is_valid_extended_public_key(this.state.mnemonic)){
                walletActions.createExtendedReadOnlyWallet(this.state.name, this.state.mnemonic, this.state.network_type).then(() => {
                    this.props.history.goBack();
                    this.setState({ saving: false });
                }).catch(exp => {
                    show_notification(exp)
                });
            }else{
                show_notification("Invalid address or extended public key");
            }
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
