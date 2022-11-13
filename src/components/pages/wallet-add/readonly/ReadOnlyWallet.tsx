import React from 'react';
import { WalletCreate } from '../WalletCreate';
import WalletName from '../elements/WalletName';
import ReadOnlyWalletAddress from './ReadOnlyWalletAddress';
import {
  is_valid_address,
  get_base58_extended_public_key,
} from '../../../../util/util';
import { WalletAction } from '../../../../action/action';
import { SnackbarMessage, VariantType } from 'notistack';
import { GlobalStateType } from '../../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { showMessage } from '../../../../store/actions';

class ReadOnlyWallet extends WalletCreate {
  steps = ['Name', 'Address'];
  renderName = () => (
    <WalletName
      name={this.state.name}
      goBack={this.props.back}
      goForward={(name) => this.gotoMnemonic(name)}
    >
      <React.Fragment>
        Wallet Name.
        <p style={{ color: 'red' }}>
          This is a read-only wallet and cannot be used to sign any transaction.
          You need the corresponding cold wallet in order to sign transactions
          and send funds from this wallet.
        </p>
      </React.Fragment>
    </WalletName>
  );

  saveWallet = () => {
    if (!this.state.saving) {
      this.setState({ saving: true });
      const base58 = get_base58_extended_public_key(this.state.mnemonic);
      if (is_valid_address(this.state.mnemonic)) {
        WalletAction.createReadOnlyWallet(
          this.state.name,
          this.state.mnemonic,
          this.state.network_type
        )
          .then(() => {
            this.goBack();
          })
          .catch((exp) => {
            this.props.showMessage(exp, 'error');
          });
      }
      if (base58) {
        WalletAction.createExtendedReadOnlyWallet(
          this.state.name,
          base58,
          this.state.network_type
        )
          .then(() => {
            this.goBack();
          })
          .catch((exp) => {
            this.props.showMessage(exp, 'error');
          });
      } else {
        this.props.showMessage(
          'Invalid address or extended public key',
          'error'
        );
      }
    }
  };

  renderMnemonic = () => (
    <ReadOnlyWalletAddress
      address={this.state.mnemonic}
      network={this.state.network_type}
      setAddress={(address) => this.setState({ mnemonic: address })}
      setNetwork={(network) => this.setState({ network_type: network })}
      goBack={() => this.goBackName()}
      goForward={() => this.saveWallet()}
    />
  );
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ReadOnlyWallet);
