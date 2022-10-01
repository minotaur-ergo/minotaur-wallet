import React from 'react';
import * as wasm from 'ergo-lib-wasm-browser';
import { AddressDbAction } from '../../action/db';
import { UnsignedGeneratedTx } from '../../util/interface';
import Wallet from '../../db/entities/Wallet';
import Loading from '../loading/Loading';
import BottomSheet from '../bottom-sheet/BottomSheet';
import { Divider } from '@mui/material';
import { WalletQrCodeContext } from '../pages/wallet/types';
import SignTransactionDisplay from '../sign-transaction-display/SignTransactionDisplay';
import TxView from '../display-tx/TxView';

interface PropsType {
  transaction?: UnsignedGeneratedTx;
  show: boolean;
  close: () => any;
  wallet: Wallet;
}

interface StateType {
  addresses: Array<string>;
  loaded_wallet_id: number;
  loading: boolean;
}

class GenerateTransactionBottomSheet extends React.Component<
  PropsType,
  StateType
> {
  state = {
    addresses: [],
    loaded_wallet_id: -1,
    loading: false,
  };

  loadAddresses = () => {
    if (
      !this.state.loading &&
      this.props.wallet.id !== this.state.loaded_wallet_id
    ) {
      const wallet_id = this.props.wallet.id;
      this.setState({ loading: true });
      AddressDbAction.getWalletAddresses(wallet_id).then((addresses) => {
        const address_array = addresses.map((item) => item.address);
        this.setState({
          loaded_wallet_id: wallet_id,
          addresses: address_array,
          loading: false,
        });
      });
    }
  };

  componentDidUpdate = () => {
    this.loadAddresses();
  };

  componentDidMount = () => {
    this.loadAddresses();
  };

  render_transaction = () => {
    if (
      this.state.loaded_wallet_id === this.props.wallet.id &&
      this.props.transaction &&
      this.props.transaction.tx &&
      this.props.transaction.boxes
    ) {
      const tx = this.props.transaction.tx;
      const unsigned_tx = tx.hasOwnProperty('unsigned_tx')
        ? (tx as wasm.ReducedTransaction).unsigned_tx()
        : (tx as wasm.UnsignedTransaction);
      const boxes = this.props.transaction.boxes;
      const box_array = Array(boxes.len()).map((item, index) =>
        boxes.get(index)
      );
      return (
        <React.Fragment>
          <TxView
            network_type={this.props.wallet.network_type}
            tx={unsigned_tx}
            boxes={box_array}
            addresses={this.state.addresses}
          />
          <Divider />
        </React.Fragment>
      );
    } else {
      return <Loading />;
    }
  };

  render = () => {
    return (
      <BottomSheet show={this.props.show} close={this.props.close}>
        {this.render_transaction()}
        <SignTransactionDisplay
          completed={() => null}
          contextType={WalletQrCodeContext}
          wallet={this.props.wallet}
          show={this.props.show}
          close={this.props.close}
          transaction={this.props.transaction}
        />
      </BottomSheet>
    );
  };
}

export default GenerateTransactionBottomSheet;
