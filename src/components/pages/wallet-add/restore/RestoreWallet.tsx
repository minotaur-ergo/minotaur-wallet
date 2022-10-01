import React from 'react';
import Mnemonic from './Mnemonic';
import AddressConfirm from './AddressConfirm';
import { WalletCreate } from '../WalletCreate';
import { GlobalStateType } from '../../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../../store/actions';

// nominee pretty fabric dance opinion lemon attend garden market rally bread own own material icon
class RestoreWallet extends WalletCreate {
  componentDidMount() {
    this.setState({ mnemonic: '' });
    // this.setState({mnemonic: ''})
  }

  renderMnemonic = () => (
    <Mnemonic
      mnemonic_passphrase={this.state.mnemonic_passphrase}
      mnemonic={this.state.mnemonic}
      goBack={() => this.goBackName()}
      goForward={(mnemonic: string, mnemonic_passphrase: string) =>
        this.goConfirm(mnemonic, mnemonic_passphrase)
      }
    />
  );
  renderConfirm = () => (
    <AddressConfirm
      network_type={this.state.network_type}
      mnemonic={this.state.mnemonic}
      password={this.state.mnemonic_passphrase}
      goBack={() => this.setState({ step: 1 })}
      goForward={this.goPassword}
    />
  );
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RestoreWallet);
