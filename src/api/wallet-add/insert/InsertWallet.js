import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import WalletName from "../WalletName";
import Mnemonic from "./Mnemonic";
import MnemonicConfirm from "./MnemonicConfirm";
import { withRouter } from "react-router-dom";
import WalletType from "./WalletType";
import { createWallet } from "../../../db/action/Wallet";

class WalletNormalNew extends React.Component {
    state = {
        mnemonic: "",
        name: "",
        password: "",
        step: 0,
        type: "normal"
    }
    steps = [
        'Name',
        'Mnemonic',
        'Confirm',
    ];

    gotoMnemonic = (name, password) => {
        this.setState({
            name: name,
            password: password,
            step: 1
        })
    }
    saveWallet = () => {
        createWallet(this.state.name, this.state.type, this.state.mnemonic, this.state.password).then(() => {
            this.props.history.goBack();
        });
    }

    render = () => {
        return (
            <React.Fragment>
                <Stepper activeStep={this.state.step} alternativeLabel>
                    {this.steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {this.state.step === 0 ? (
                    <WalletName {...this.state} goBack={this.props.back}
                                goForward={({name, password}) => this.gotoMnemonic(name, password)} confirm={true}>
                        Enter new wallet name and password.
                        <p style={{color: "red"}}>
                            Be careful if you lose your password you will not be able to recover the ergs in your wallet
                        </p>
                        <WalletType value={this.state.type} setValue={value => this.setState({type: value})}/>
                    </WalletName>
                ) : null}
                {this.state.step === 1 ? (
                    <Mnemonic {...this.state} goBack={() => this.setState({step: 0, mnemonic: ''})}
                              goForward={mnemonic => {
                                  this.setState({step: 2, mnemonic: mnemonic})
                              }}/>
                ) : null}
                {this.state.step === 2 ? (
                    <MnemonicConfirm {...this.state} goBack={() => this.setState({step: 1})}
                                     goForward={this.saveWallet}/>
                ) : null}
            </React.Fragment>
        )
    }
}

export default withRouter(WalletNormalNew)
