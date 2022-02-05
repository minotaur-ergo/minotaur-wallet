import React from "react";
import WalletName from "../WalletName";
import Mnemonic from "./Mnemonic";
import MnemonicConfirm from "./MnemonicConfirm";
import { withRouter } from "react-router-dom";
import WalletTypeSelect from "../elements/WalletTypeSelect";
import WalletCreate from "../WalletCreate";

class InsertWallet extends WalletCreate {
    renderName = () => (
        <WalletName
            name={this.state.name}
            password={this.state.mnemonicPassPhrase}
            goBack={this.props.back}
            confirm={true}
            goForward={(name, password) => this.gotoMnemonic(name, password)}>
            <>
                Enter new wallet name and password.
                <p style={{ color: "red" }}>
                    Be careful if you lose your password you will not be able to recover the ergs in your wallet
                </p>
                <WalletTypeSelect value={this.state.type} setValue={value => this.setState({ type: value })} />
            </>
        </WalletName>
    );

    renderMnemonic = () => (
        <Mnemonic
            mnemonic={this.state.mnemonic}
            goBack={() => this.goBackName()}
            network={this.state.network_type}
            goForward={(mnemonic: string, network: string) => this.goConfirm(mnemonic, network)} />

    );

    renderConfirm = () => (
        <MnemonicConfirm
            mnemonic={this.state.mnemonic}
            goBack={() => this.setState({ step: 1 })}
            goForward={this.goPassword} />

    );
}

export default withRouter(InsertWallet);
