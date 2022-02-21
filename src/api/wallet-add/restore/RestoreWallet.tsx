import React from "react";
import Mnemonic from "./Mnemonic";
import AddressConfirm from "./AddressConfirm";
import { withRouter } from "react-router-dom";
import WalletCreate from "../WalletCreate";

// nominee pretty fabric dance opinion lemon attend garden market rally bread own own material icon
class RestoreWallet extends WalletCreate {
    componentDidMount() {
        this.setState({ mnemonic: "" });
        // this.setState({mnemonic: ''})
    }

    renderMnemonic = () => (
        <Mnemonic
            network={this.state.network_type}
            mnemonic={this.state.mnemonic}
            goBack={() => this.goBackName()}
            goForward={(mnemonic: string, network: string) => this.goConfirm(mnemonic, network)} />
    );
    renderConfirm = () => (
        <AddressConfirm
            network_type={this.state.network_type}
            mnemonic={this.state.mnemonic}
            password={this.state.mnemonicPassPhrase}
            goBack={() => this.setState({ step: 1 })}
            goForward={this.goPassword} />
    );
}

export default withRouter(RestoreWallet);
