import {WalletCreate} from "../WalletCreate";
import {GlobalStateType} from "../../../../store/reducer";
import {connect, MapDispatchToProps} from "react-redux";
import {SnackbarMessage, VariantType} from "notistack";
import {showMessage} from "../../../../store/actions";
import WalletName from "../elements/WalletName";
import React from "react";
import TotalSign from "./TotalSign";
import PublicKeys from "./PublicKeys";


class MultiSigWallet extends WalletCreate {
    steps = [
        "Name",
        "Signers",
        "Public Keys",
        "Confirm"
    ]

    goPublicKeys = (total: string) => {
        const public_keys = Array(parseInt(total)).fill("")
        this.setState({public_keys: public_keys, step: 2});
    }

    goMultiSigConfirm = (public_keys: Array<string>) => {
        this.setState({public_keys: public_keys, step: 3});
    }

    goBackTotal = () => {
        this.setState({step: 1})
    }
    renderConfirm = () => (
        <PublicKeys
            public_keys={this.state.public_keys}
            goBack={this.goBackTotal    }
            goForward={(public_keys) => this.goMultiSigConfirm(public_keys)}>
            Please enter total number of signers
        </PublicKeys>
    );

    renderMnemonic = () => (
        <TotalSign
            total={this.state.public_keys.length ? "" + this.state.public_keys.length : ""}
            goBack={this.goBackName}
            goForward={(total) => this.goPublicKeys(total)}>
            Please enter total number of signers
        </TotalSign>
    );


    renderName = () => (
        <WalletName
            name={this.state.name}
            goBack={this.props.back}
            goForward={(name) => this.gotoMnemonic(name)}>
            <>
                Enter new multi-sig wallet name:
            </>
        </WalletName>
    );

    renderPassword = () => {
        return (
            <div>salam</div>
        )
    }
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant))
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSigWallet);

