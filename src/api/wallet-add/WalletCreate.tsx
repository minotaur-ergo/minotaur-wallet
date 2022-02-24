import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router-dom";
import { WalletType } from "../../db/entities/Wallet";
import * as walletActions from "../../action/wallet";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import WalletName from "./WalletName";
import WalletTypeSelect from "./elements/WalletTypeSelect";
import { NETWORK_TYPES } from "../../config/network_type";
import WalletPassword from "./WalletPassword";
import { show_notification } from "../../utils/utils";

interface PropsType extends RouteComponentProps {
    back: () => any;
}

interface StateType {
    mnemonic: string;
    mnemonicPassPhrase: string;
    step: number;
    name: string;
    type: WalletType;
    saving: boolean;
    network_type: string;
}


class WalletCreate extends React.Component<PropsType, StateType> {
    state: StateType = {
        mnemonic: "",
        mnemonicPassPhrase: "",
        step: 0,
        name: "",
        type: WalletType.Normal,
        saving: false,
        network_type: NETWORK_TYPES[0].label
    };
    steps = [
        "Name",
        "Mnemonic",
        "Confirm",
        "Password"
    ];

    gotoMnemonic = (name: string, password: string) => {
        this.setState({ name: name, mnemonicPassPhrase: password, step: 1 });
    };

    goPassword = () => {
        this.setState({step: 3});
    }

    goBackName = () => {
        this.setState({ step: 0 });
    };

    goConfirm = (mnemonic: string, network: string) => {
        this.setState({ mnemonic: mnemonic, step: 2, network_type: network });
    };

    saveWallet = (password: string) => {
        if (!this.state.saving) {
            this.setState({ saving: true });
            walletActions.createWallet(
                this.state.name,
                this.state.type,
                this.state.mnemonic,
                this.state.mnemonicPassPhrase,
                this.state.network_type,
                password
            ).then(() => {
                this.props.history.goBack();
                this.setState({ saving: false });
            }).catch(exp => {
                show_notification(exp)
            });
        }
    };

    renderName = () => (
        <WalletName
            name={this.state.name}
            password={this.state.mnemonicPassPhrase}
            goBack={this.props.back}
            confirm={false}
            goForward={(name, password) => this.gotoMnemonic(name, password)}>
            <>
                <p>Enter wallet name and password.</p>
                <WalletTypeSelect value={this.state.type} setValue={value => this.setState({ type: value })} />
            </>
        </WalletName>
    );

    renderPassword = () => (
        <WalletPassword
            goForward={(password) => this.saveWallet(password)}
            goBack={() => this.goConfirm(this.state.mnemonic, this.state.network_type)}
        />)

    renderMnemonic = (): ReactNode | null => null;

    renderConfirm = (): ReactNode | null => null;


    render = () => (
        <React.Fragment>
            <Stepper activeStep={this.state.step} alternativeLabel>
                {this.steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {this.state.step === 0 ? this.renderName() : null}
            {this.state.step === 1 ? this.renderMnemonic() : null}
            {this.state.step === 2 ? this.renderConfirm() : null}
            {this.state.step === 3 ? this.renderPassword() : null}
        </React.Fragment>
    );

}

export default WalletCreate;
