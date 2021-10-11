import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Name from "../Name";
import NewWalletMnemonic from "../new-wallet/Mnemonic";
import MnemonicConfirm from "../new-wallet/MnemonicConfirm";
import { withRouter } from "react-router-dom";
import { createNormalWallet } from "../../../db/commands/wallet";
import { mnemonicToSeedSync } from 'bip39'
import { fromSeed } from 'bip32'
import { Address, SecretKey, SecretKeys } from "ergo-lib-wasm-browser";

class WalletNormalNew extends React.Component {
  state = {
    mnemonic: "",
    name: "",
    password: "",
    step: 0,
  }
  steps = [
    'Name',
    'Mnemonic',
    'Confirm',
  ];

  gotoMnemonic = (name, mnemonic) => {
    this.setState({
      name: name,
      mnemonic: mnemonic,
      step: 1
    })
  }

  saveWallet = () => {
    const seed = mnemonicToSeedSync(this.state.mnemonic, this.state.password);
    const bip32Seed = fromSeed(seed);
    const master = bip32Seed.derive(0)
    const secret = SecretKey.dlog_from_bytes(master.privateKey);
    createNormalWallet(this.state.name, this.state.mnemonic, "no address", "m/0");
    this.props.history.goBack();
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
          <Name {...this.state} goBack={this.props.back}
                goForward={({name, mnemonic}) => this.gotoMnemonic(name, mnemonic)} confirm={true}>
            Enter new wallet name and password.
            <p style={{color: "red"}}>
              Be careful if you lose your password you will not be able to recover the ergs in your wallet
            </p>
          </Name>
        ) : null}
        {this.state.step === 1 ? (
          <NewWalletMnemonic {...this.state} goBack={() => this.setState({step: 0, mnemonic: ''})}
                             goForward={mnemonic => {
                               this.setState({step: 2, mnemonic: mnemonic})
                             }}/>
        ) : null}
        {this.state.step === 2 ? (
          <MnemonicConfirm {...this.state} goBack={() => this.setState({step: 1})} goForward={this.saveWallet}/>
        ) : null}
      </React.Fragment>
    )
  }
}

export default withRouter(WalletNormalNew)
