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
    password: string;
}


class WalletCreate extends React.Component<PropsType, StateType> {
    state: StateType = {
        mnemonic: "",
        mnemonicPassPhrase: "",
        step: 0,
        name: "",
        type: WalletType.Normal,
        saving: false,
        network_type: NETWORK_TYPES[0].label,
        password: ""
    };
    steps = [
        "Name",
        "Mnemonic",
        "Confirm"
    ];

    gotoMnemonic = (name: string, password: string, dbPassword: string) => {
        this.setState({ name: name, mnemonicPassPhrase: password, password: dbPassword, step: 1 });
    };

    goBackName = () => {
        this.setState({ step: 0 });
    };

    goConfirm = (mnemonic: string, network: string) => {
        this.setState({ mnemonic: mnemonic, step: 2, network_type: network });
    };

    saveWallet = () => {
        if (!this.state.saving) {
            this.setState({ saving: true });
            walletActions.createWallet(
                this.state.name,
                this.state.type,
                this.state.mnemonic,
                this.state.mnemonicPassPhrase,
                this.state.network_type,
                this.state.password
            ).then(() => {
                this.props.history.goBack();
                this.setState({ saving: false });
            });
        }
    };

    renderName = () => (
        <WalletName
            name={this.state.name}
            password={this.state.mnemonicPassPhrase}
            dbPassword={this.state.password}
            goBack={this.props.back}
            confirm={false}
            goForward={(name, password, dbPassword) => this.gotoMnemonic(name, password, dbPassword)}>
            <>
                <p>Enter wallet name and password.</p>
                <WalletTypeSelect value={this.state.type} setValue={value => this.setState({ type: value })} />
            </>
        </WalletName>
    );

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
        </React.Fragment>
    );

}

export default WalletCreate;
