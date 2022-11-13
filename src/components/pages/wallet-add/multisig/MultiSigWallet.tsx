import { WalletCreate } from '../WalletCreate';
import { GlobalStateType } from '../../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../../store/actions';
import WalletName from '../elements/WalletName';
import React from 'react';
import TotalSign from './TotalSign';
import PublicKeys from './PublicKeys';
import { Typography } from '@mui/material';
import AddressConfirm from './AddressConfirm';
import { WalletAction } from '../../../../action/action';

class MultiSigWallet extends WalletCreate {
  steps = ['Name', 'Signers', 'Public Keys', 'Confirm'];

  saveWallet = () => {
    if (!this.state.saving) {
      this.setState({ saving: true });
      WalletAction.createMultiSigWallet(
        this.state.name,
        this.state.wallet,
        this.state.public_keys,
        this.state.minSig
      )
        .then((res) => this.goBack())
        .catch((err) => {
          this.props.showMessage('Error creating wallet', 'error');
          this.setState({ saving: false });
        });
    }
  };
  goPublicKeys = (total: number, minSig: number) => {
    const public_keys = Array(total - 1).fill('');
    this.setState({ public_keys: public_keys, step: 2, minSig: minSig });
  };

  goMultiSigConfirm = (wallet: number, public_keys: Array<string>) => {
    this.setState({ public_keys: public_keys, step: 3, wallet: wallet });
  };

  goBackTotal = () => {
    this.setState({ step: 1 });
  };

  renderConfirm = () => (
    <PublicKeys
      public_keys={this.state.public_keys}
      goBack={this.goBackTotal}
      wallet={this.state.wallet}
      goForward={(wallet: number, public_keys: Array<string>) =>
        this.goMultiSigConfirm(wallet, public_keys)
      }
    ></PublicKeys>
  );

  renderMnemonic = () => {
    return (
      <TotalSign
        minSign={3}
        total={
          this.state.public_keys.length ? this.state.public_keys.length : 2
        }
        goBack={this.goBackName}
        goForward={(total: number, minSig: number) =>
          this.goPublicKeys(total, minSig)
        }
      ></TotalSign>
    );
  };

  renderName = () => (
    <WalletName
      name={this.state.name}
      goBack={this.props.back}
      goForward={(name) => this.gotoMnemonic(name)}
    >
      <React.Fragment>
        <Typography>Choose a name for your multi-signature wallet</Typography>
        <br />
      </React.Fragment>
    </WalletName>
  );

  renderPassword = () => {
    return (
      <AddressConfirm
        wallet={this.state.wallet}
        minSig={this.state.minSig}
        goBack={() => this.setState({ step: 2 })}
        goForward={() => this.saveWallet()}
        public_keys={this.state.public_keys}
      />
    );
  };
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSigWallet);
