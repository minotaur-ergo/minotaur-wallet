import React from 'react';
import { WalletPagePropsType } from '../../../util/interface';
import { Card, CardContent, Container, Grid } from '@mui/material';
import { connect } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import AppHeader from '../../app-header/AppHeader';
import WithAppBar from '../../../layout/WithAppBar';
import * as wasm from 'ergo-lib-wasm-browser';
import MultiSigSignProcess from '../../multi-sig/MultiSigSignProcess';
import MultiSigDataReader from '../../multi-sig/MultiSigDataReader';
import { Action, Dispatch } from 'redux';
import {
  MultiSigDbAction,
  MultiStoreDbAction,
  WalletDbAction,
} from '../../../action/db';
import MultiSignRow from '../../../db/entities/multi-sig/MultiSignRow';
import { MultiSigTxType } from '../../../db/entities/multi-sig/MultiSignTx';

interface MultiSigCommunicationPropsType
  extends WalletPagePropsType,
    MessageEnqueueService {}

interface MultiSigSignTxRow {
  commitment: Array<Array<string>>;
  partial?: wasm.Transaction;
  tx: wasm.ReducedTransaction;
  boxes: wasm.ErgoBoxes;
  saved?: MultiSignRow;
  secrets?: Array<Array<string>>;
  signed: Array<string>;
  simulated: Array<string>;
}

interface MultiSigCommunicationStateType {
  rows: Array<MultiSigSignTxRow>;
}

interface InputData {
  tx: string;
  boxes: Array<string>;
  commitments: Array<Array<string>>;
}

class MultiSigCommunication extends React.Component<
  MultiSigCommunicationPropsType,
  MultiSigCommunicationStateType
> {
  state: MultiSigCommunicationStateType = {
    rows: [],
  };

  loadSavedTxs = async () => {
    const saved: Array<MultiSigSignTxRow> = [];
    const wallet = await WalletDbAction.getWalletById(this.props.wallet.id);
    if (wallet) {
      const keys = await MultiSigDbAction.getWalletExternalKeys(wallet.id);
      const rows = await MultiStoreDbAction.getWalletMultiSigRows(wallet);
      for (const row of rows) {
        const tx = await MultiStoreDbAction.getTx(row, MultiSigTxType.Reduced);
        const partial = await MultiStoreDbAction.getTx(
          row,
          MultiSigTxType.Partial
        );
        const { signed, simulated } = await MultiStoreDbAction.getSigners(row);
        const boxesBase64 = await MultiStoreDbAction.getInputs(row);
        const { commitments, secrets } =
          await MultiStoreDbAction.getCommitments(
            row,
            boxesBase64.length,
            keys.length + 1
          );
        const boxes = wasm.ErgoBoxes.empty();
        boxesBase64.forEach((item) =>
          boxes.add(wasm.ErgoBox.sigma_parse_bytes(Buffer.from(item, 'base64')))
        );
        saved.push({
          tx: wasm.ReducedTransaction.sigma_parse_bytes(
            Buffer.from(tx, 'base64')
          ),
          partial: partial
            ? wasm.Transaction.sigma_parse_bytes(Buffer.from(partial, 'base64'))
            : undefined,
          boxes,
          secrets,
          commitment: commitments,
          saved: row,
          signed,
          simulated,
        });
      }
      this.setState({ rows: saved });
    }
  };

  componentDidMount = () => {
    this.props.setTab('send');
    this.loadSavedTxs().then(() => null);
  };

  newDataReceived = (newData: string) => {
    try {
      const data: InputData = JSON.parse(newData) as InputData;
      const tx = wasm.ReducedTransaction.sigma_parse_bytes(
        Uint8Array.from(Buffer.from(data.tx, 'base64'))
      );
      const newTxId = tx.unsigned_tx().id().to_str();
      if (
        this.state.rows.filter(
          (obj) => obj.tx.unsigned_tx().id().to_str() === newTxId
        ).length > 0
      ) {
        this.props.showMessage('Entered tx already exists in list', 'error');
      } else {
        const boxes = wasm.ErgoBoxes.empty();
        data.boxes
          .map((item) =>
            wasm.ErgoBox.sigma_parse_bytes(
              Uint8Array.from(Buffer.from(item, 'base64'))
            )
          )
          .forEach((box) => boxes.add(box));
        const newRow: MultiSigSignTxRow = {
          commitment: data.commitments,
          boxes,
          tx,
          signed: [],
          simulated: [],
        };
        this.setState((state) => ({ ...state, rows: [...state.rows, newRow] }));
      }
    } catch (e) {
      console.log(e);
      this.props.showMessage('Invalid Data in clipboard', 'error');
    }
  };

  removeRow = (index: number) => {
    const row = this.state.rows[index];
    this.setState((state) => {
      const newState = { ...state, rows: [...state.rows] };
      newState.rows.splice(index, 1);
      return newState;
    });
    if (row.saved) {
      MultiStoreDbAction.removeMultiSigRow(row.saved).then(() => null);
    }
  };

  saveInstance = (index: number, row: MultiSignRow) => {
    this.setState((state) => {
      const newState = { ...state, rows: [...state.rows] };
      newState.rows[index] = { ...newState.rows[index], saved: row };
      return newState;
    });
  };

  render = () => {
    return (
      <WithAppBar header={<AppHeader title="Multi Sig" hideQrCode={true} />}>
        {this.state.rows.map((item, index) => (
          <Container key={index}>
            <Grid
              container
              spacing={2}
              style={{ textAlign: 'center' }}
              marginTop={3}
            >
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <MultiSigSignProcess
                      wallet={this.props.wallet}
                      partial={item.partial}
                      signed={item.signed}
                      simulated={item.simulated}
                      commitments={item.commitment}
                      tx={item.tx}
                      row={item.saved}
                      boxes={item.boxes}
                      encryptedSecrets={item.secrets}
                      saved={
                        item.saved
                          ? undefined
                          : (row: MultiSignRow) => this.saveInstance(index, row)
                      }
                      close={() => this.removeRow(index)}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        ))}
        <Container style={{ marginTop: 20 }}>
          <Grid container spacing={2} style={{ textAlign: 'center' }}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <MultiSigDataReader
                    newData={(data: string) => this.newDataReceived(data)}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </WithAppBar>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiSigCommunication);
