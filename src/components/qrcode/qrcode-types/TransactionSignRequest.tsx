import React from 'react';
import AppHeader from '../../app-header/AppHeader';
import WithAppBar from '../../../layout/WithAppBar';
import * as wasm from 'ergo-lib-wasm-browser';
// import TxView from "../../../components/display-tx/TxView";
import { Container, Divider, Grid } from '@mui/material';
import DisplayId from '../../display-id/DisplayId';
import Wallet from '../../../db/entities/Wallet';
import WalletPassword from '../../inputs/WalletPassword';
import Address from '../../../db/entities/Address';
import AddressWithErg from '../../../db/entities/views/AddressWithErg';
import BottomSheet from '../../../components/bottom-sheet/BottomSheet';
import { AddressDbAction, WalletDbAction } from '../../../action/db';
import { UnsignedGeneratedTx } from '../../../util/interface';
import { BlockChainAction } from '../../../action/blockchain';
import RequestQrcodeDisplay from '../../request-qrcode-display/RequestQrcodeDisplay';
import TxView from '../../display-tx/TxView';
// import { UnsignedGeneratedTx } from "../../../utils/interface";

interface TransactionSignRequestPropsType {
  closeQrcode: () => any;
  completed?: (result: string) => any;
  tx: { reducedTx: string; sender: string; inputs: Array<string> };
}

interface TransactionSignRequestStateType {
  reducedTx?: wasm.ReducedTransaction;
  boxes: Array<wasm.ErgoBox>;
  loading: boolean;
  loadedSender: string;
  addresses: Array<string>;
  error: boolean;
  password: string;
  wallet?: Wallet;
  walletAddress?: Address | AddressWithErg;
  signed: string;
}

class TransactionSignRequest extends React.Component<
  TransactionSignRequestPropsType,
  TransactionSignRequestStateType
> {
  state: TransactionSignRequestStateType = {
    loading: false,
    loadedSender: '',
    addresses: [],
    error: false,
    reducedTx: undefined,
    boxes: [],
    password: '',
    wallet: undefined,
    walletAddress: undefined,
    signed: '',
  };
  _base64ToArrayBuffer = (base64: string): Uint8Array => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  loadTx = () => {
    if (
      !this.state.loading &&
      this.state.loadedSender !== this.props.tx.sender
    ) {
      this.setState({ loading: true });
      // debugger
      const { reducedTx, sender, inputs } = this.props.tx;
      AddressDbAction.getAddressByAddressString(sender).then((address) => {
        if (address && address.walletId) {
          WalletDbAction.getWalletById(address.walletId).then((wallet) => {
            AddressDbAction.getWalletAddresses(address.walletId).then(
              (addresses) => {
                const txBytes = this._base64ToArrayBuffer(reducedTx);
                const reduced =
                  wasm.ReducedTransaction.sigma_parse_bytes(txBytes);
                const boxes = inputs.map((item) =>
                  wasm.ErgoBox.sigma_parse_bytes(
                    this._base64ToArrayBuffer(item)
                  )
                );
                this.setState({
                  wallet: wallet ? wallet : undefined,
                  reducedTx: reduced,
                  boxes: boxes,
                  loading: false,
                  loadedSender: sender,
                  addresses: addresses.map((address) => address.address),
                  walletAddress: addresses[0],
                });
              }
            );
          });
        } else {
          this.setState({ loading: false, error: true, loadedSender: sender });
        }
      });
    }
  };

  signTx = () => {
    if (this.state.reducedTx) {
      const txReduced = this.state
        .reducedTx as unknown as wasm.ReducedTransaction;
      const boxes = new wasm.ErgoBoxes(this.state.boxes[0]);
      for (let index = 1; index < this.state.boxes.length; index++) {
        boxes.add(this.state.boxes[index]);
      }
      const tx: UnsignedGeneratedTx = {
        tx: txReduced,
        boxes: boxes,
      };
      const wallet = this.state.wallet;
      if (wallet) {
        BlockChainAction.signTx(wallet, tx, this.state.password).then(
          (signed) => {
            const base64Data = Buffer.from(
              signed.sigma_serialize_bytes()
            ).toString('base64');
            this.setState({ signed: JSON.stringify({ signedTx: base64Data }) });
          }
        );
      }
    }
  };

  componentDidMount() {
    this.loadTx();
  }

  componentDidUpdate() {
    this.loadTx();
  }

  render = () => {
    const reduced = this.state.reducedTx;
    return (
      <WithAppBar
        header={
          <AppHeader
            hideQrCode={true}
            title="Signing transaction"
            back={this.props.closeQrcode}
          />
        }
      >
        {reduced !== undefined ? (
          <React.Fragment>
            <TxView
              network_type={
                this.state.wallet ? this.state.wallet.network_type : ''
              }
              tx={(reduced as wasm.ReducedTransaction).unsigned_tx()}
              boxes={this.state.boxes}
              addresses={this.state.addresses}
            />
            <Divider />
            {this.state.wallet !== undefined &&
            this.state.walletAddress !== undefined ? (
              <WalletPassword
                size={'small'}
                password={this.state.password}
                setPassword={(password: string) =>
                  this.setState({ password: password })
                }
                complete={() => this.signTx()}
                wallet={this.state.wallet}
                address={this.state.walletAddress}
              />
            ) : null}
          </React.Fragment>
        ) : this.state.error ? (
          <Grid container>
            <Grid item xs={12}>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '40%',
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <h2>Scanned transaction addresses is invalid.</h2>
                <h3>
                  <DisplayId id={this.props.tx.sender} />
                </h3>
              </div>
            </Grid>
          </Grid>
        ) : null}
        <BottomSheet
          show={this.state.signed.length > 0}
          close={() => this.props.closeQrcode()}
        >
          <Container>
            <Grid container spacing={2} style={{ textAlign: 'center' }}>
              <React.Fragment>
                <Grid item xs={12}>
                  Please scan code below on your hot wallet to send it to
                  blockchain
                </Grid>
                {this.state.signed ? (
                  <RequestQrcodeDisplay
                    requestType={'CSTX'}
                    requestData={this.state.signed}
                  />
                ) : null}
              </React.Fragment>
            </Grid>
          </Container>
        </BottomSheet>
      </WithAppBar>
    );
  };
}

export default TransactionSignRequest;
