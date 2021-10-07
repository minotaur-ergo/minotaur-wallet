import React from "react";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import WalletInsertOption from "./WalletInsertOption";
import NewWalletMnemonic from "./new-wallet/Mnemonic";
import MnemonicConfirm from "./new-wallet/MnemonicConfirm";
import Name from "./Name";
import Address from "./readonly-wallet/Address";


class AddWalletBody extends React.Component {
    state = {
        activeStep: 0,
        walletType: null,
        payload: {
            mnemonic: "",
            password: "",
            address: "",
            name: "",
        }
    }
    steps = [
        'Type',
        'Name',
        'Credentials',
        'Confirm'
    ];

    selectType = (walletType) => {
        this.setState({walletType: walletType, activeStep: 1})
    }

    gotoStep = (step, payload) => {
        this.setState(state => ({
            ...state,
            activeStep: step,
            payload: {...state.payload, ...payload}
        }))
    }

    renderNameWallet = () => {
        if(this.state.walletType === "new"){
            return (
                <Name {...this.state.payload} setStep={this.gotoStep} confirm={true}>
                    Enter new wallet name and password.
                    <p style={{color: "red"}}>
                        Be careful if you lose your password you will not be able to recover the ergs in your wallet
                    </p>
                </Name>
            )
        }else if(this.state.walletType === "restore"){
            return (
                <Name {...this.state.payload} setStep={this.gotoStep} confirm={false}>
                    Enter new wallet name and password you entered for your wallet.
                </Name>
            )

        }else if(this.state.walletType === "readonly"){
            return (
                <Name {...this.state.payload} setStep={this.gotoStep} hidePassword={true}>
                    Enter new wallet name.
                </Name>
            )

        }
    }

    renderCredentialWallet = () => {
        if(this.state.walletType === "new"){
            return (
                <NewWalletMnemonic {...this.state.payload} setStep={this.gotoStep}/>
            )
        }else if(this.state.walletType === "readonly"){
            return (
                <Address {...this.state.payload} setStep={this.gotoStep}/>
            )
        }
    }

    renderConfirmWallet = () => {
        if(this.state.walletType === "new"){
            return (
                <MnemonicConfirm {...this.state.payload} setStep={this.gotoStep}/>
            )
        }
    }

    render = () => {
        return (
            <React.Fragment>
                <Stepper activeStep={this.state.activeStep} alternativeLabel>
                    {this.steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {this.state.activeStep === 0 ? <WalletInsertOption setWalletType={this.selectType}/> : null}
                {this.state.activeStep === 1 ? this.renderNameWallet(): null}
                {this.state.activeStep === 2 ? this.renderCredentialWallet(): null}
                {this.state.activeStep === 3 ? this.renderConfirmWallet(): null}
                {/*<div>new wallet</div>*/}
                {/*<div>restore wallet</div>*/}
                {/*<div>readonly wallet</div>*/}
            </React.Fragment>
        )
    }
}

export default AddWalletBody;
