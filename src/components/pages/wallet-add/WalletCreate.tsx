import React, { ReactNode } from 'react';
import { WalletType } from '../../../db/entities/Wallet';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import WalletName from './elements/WalletName';
import WalletPassword from './WalletPassword';
import { NETWORK_TYPES } from '../../../util/network_type';
import { WalletAction } from '../../../action/action';
import { SnackbarMessage, VariantType } from 'notistack';
import { MessageEnqueueService } from '../../app/MessageHandler';
import { connect, MapDispatchToProps } from 'react-redux';
import { showMessage } from '../../../store/actions';
import { Grid, Typography } from '@mui/material';
import WalletNetworkSelect from './elements/WalletNetworkSelect';
import { NavigateFunction } from 'react-router-dom';

interface WalletCreatePropsType extends MessageEnqueueService {
  back: () => unknown;
  navigate: NavigateFunction;
}

interface WalletCreateStateType {
  mnemonic: string;
  mnemonic_passphrase: string;
  step: number;
  name: string;
  type: WalletType;
  saving: boolean;
  network_type: string;
  public_keys: Array<string>;
  minSig: number;
  wallet: number;
}

class WalletCreate extends React.Component<
  WalletCreatePropsType,
  WalletCreateStateType
> {
  state: WalletCreateStateType = {
    mnemonic: '',
    mnemonic_passphrase: '',
    step: 0,
    name: '',
    type: WalletType.Normal,
    saving: false,
    network_type: NETWORK_TYPES[0].label,
    public_keys: [],
    minSig: 1,
    wallet: -1,
  };

  steps = ['Name', 'Mnemonic', 'Confirm', 'Password'];

  gotoMnemonic = (name: string) => {
    this.setState({ name: name, step: 1 });
  };

  goPassword = () => {
    this.setState({ step: 3 });
  };

  goBackName = () => {
    this.setState({ step: 0 });
  };

  goConfirm = (mnemonic: string, mnemonic_passphrase: string) => {
    this.setState({
      mnemonic: mnemonic,
      step: 2,
      mnemonic_passphrase: mnemonic_passphrase,
    });
  };

  goBack = () => {
    this.props.navigate(-1);
  };

  saveWallet = (password: string) => {
    if (!this.state.saving) {
      this.setState({ saving: true });
      WalletAction.createWallet(
        this.state.name,
        this.state.type,
        this.state.mnemonic,
        this.state.mnemonic_passphrase,
        this.state.network_type,
        password
      )
        .then(() => {
          this.goBack();
        })
        .catch((exp) => {
          this.props.showMessage(exp, 'error');
        });
    }
  };

  renderName = () => (
    <WalletName
      name={this.state.name}
      goBack={this.props.back}
      goForward={(name) => this.gotoMnemonic(name)}
    >
      <Grid item xs={12}>
        <WalletNetworkSelect
          network={this.state.network_type}
          setNetworkType={(new_network) =>
            this.setState({ network_type: new_network })
          }
        />
      </Grid>
      <Typography>Wallet Name:</Typography>
      <br />
    </WalletName>
  );

  renderPassword = () => (
    <WalletPassword
      saving={this.state.saving}
      goForward={(password) => this.saveWallet(password)}
      goBack={() =>
        this.goConfirm(this.state.mnemonic, this.state.mnemonic_passphrase)
      }
    />
  );

  renderMnemonic = (): ReactNode | null => null;

  renderConfirm = (): ReactNode | null => null;

  render = () => (
    <React.Fragment>
      <Stepper activeStep={this.state.step} alternativeLabel>
        {this.steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <br />
      {this.state.step === 0 ? this.renderName() : null}
      {this.state.step === 1 ? this.renderMnemonic() : null}
      {this.state.step === 2 ? this.renderConfirm() : null}
      {this.state.step === 3 ? this.renderPassword() : null}
    </React.Fragment>
  );
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export { WalletCreate };
export default connect(mapStateToProps, mapDispatchToProps)(WalletCreate);
