import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router-dom";
import { WalletType } from "../../db/entities/Wallet";
import * as walletActions from "../../action/wallet";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import WalletName from "./WalletName";
import WalletTypeSelect from "./elements/WalletTypeSelect";

interface PropsType extends RouteComponentProps {
    back: () => any;
}

interface statesType {
    mnemonic: string;
    mnemonicPassPhrase: string;
    step: number;
    name: string;
    type: WalletType;
    saving: boolean;
}


class WalletCreate extends React.Component<PropsType, statesType> {
    state = {
        mnemonic: "",
        mnemonicPassPhrase: "",
        step: 0,
        name: "",
        type: WalletType.Normal,
        saving: false
    };
    steps = [
        "Name",
        "Mnemonic",
        "Confirm"
    ];

    gotoMnemonic = (name: string, password: string) => {
        this.setState({ name: name, mnemonicPassPhrase: password, step: 1 });
    };

    goBackName = () => {
        this.setState({ step: 0 });
    };

    goConfirm = (mnemonic: string) => {
        this.setState({ mnemonic: mnemonic, step: 2 });
    };

    saveWallet = () => {
        if (!this.state.saving) {
            this.setState({ saving: true });
            walletActions.createWallet(this.state.name, this.state.type, this.state.mnemonic, this.state.mnemonicPassPhrase).then(() => {
                this.props.history.goBack();
                this.setState({ saving: false });
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
