import React from 'react';
import { WalletPagePropsType } from '../../../util/interface';
import { Container, Grid } from '@mui/material';
import { GlobalStateType } from '../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import AppHeader from '../../app-header/AppHeader';
import WithAppBar from '../../../layout/WithAppBar';
import * as wasm from 'ergo-lib-wasm-browser';
import MultiSigSignProcess from '../../multi-sig/MultiSigSignProcess';
import MultiSigDataReader from '../../multi-sig/MultiSigDataReader';

interface MultiSigCommunicationPropsType
  extends WalletPagePropsType,
    MessageEnqueueService {}

interface MultiSigCommunicationStateType {
  commitment: Array<Array<string>>;
  tx?: wasm.ReducedTransaction;
  boxes: wasm.ErgoBoxes;
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
    commitment: [],
    boxes: wasm.ErgoBoxes.empty(),
  };

  componentDidMount = () => {
    this.props.setTab('send');
  };

  newDataReceived = (newData: string) => {
    try {
      const data: InputData = JSON.parse(newData) as InputData;
      const tx = wasm.ReducedTransaction.sigma_parse_bytes(
        Uint8Array.from(Buffer.from(data.tx!, 'base64'))
      );
      const boxes = wasm.ErgoBoxes.empty();
      data.boxes
        .map((item) =>
          wasm.ErgoBox.sigma_parse_bytes(
            Uint8Array.from(Buffer.from(item, 'base64'))
          )
        )
        .forEach((box) => boxes.add(box));
      this.setState({
        commitment: data.commitments,
        boxes: boxes,
        tx: tx,
      });
    } catch (e) {
      console.log(e);
      this.props.showMessage('Invalid Data in clipboard', 'error');
    }
  };

  render = () => {
    return (
      <WithAppBar header={<AppHeader title="Multi Sig" hideQrCode={true} />}>
        {this.state.tx ? (
          <MultiSigSignProcess
            wallet={this.props.wallet}
            commitments={this.state.commitment}
            tx={this.state.tx}
            boxes={this.state.boxes}
            close={() =>
              this.setState({
                commitment: [],
                boxes: wasm.ErgoBoxes.empty(),
                tx: undefined,
              })
            }
          />
        ) : (
          <Container style={{ marginTop: 20 }}>
            <Grid container>
              <MultiSigDataReader
                newData={(data: string) => this.newDataReceived(data)}
              />
            </Grid>
          </Container>
        )}
      </WithAppBar>
    );
  };
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
  showMessage: (message: SnackbarMessage, variant: VariantType) =>
    dispatch(showMessage(message, variant)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiSigCommunication);
