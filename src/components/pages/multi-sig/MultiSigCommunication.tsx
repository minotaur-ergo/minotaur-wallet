import React from 'react';
import { WalletPagePropsType } from '../../../util/interface';
import { Container, Divider, FormControlLabel, FormGroup, Grid, Paper, Switch } from '@mui/material';
import { GlobalStateType } from '../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import AppHeader from '../../app-header/AppHeader';
import WithAppBar from '../../../layout/WithAppBar';
import MultiSigSignProcess from '../../multi-sig/MultiSigSignProcess';
import * as wasm from 'ergo-lib-wasm-browser';
import MultiSigDataReader from '../../multi-sig/MultiSigDataReader';
import { CoSigningCommunication } from '../../../action/cosigning';
import { AddressDbAction, MultiSigDbAction } from '../../../action/db';
import TxView from '../../display-tx/TxView';

interface MultiSigCommunicationPropsType extends WalletPagePropsType, MessageEnqueueService {
}

interface MultiSigCommunicationStateType {
    commitment: Array<Array<string>>;
    tx?: wasm.ReducedTransaction;
    boxes: wasm.ErgoBoxes;
    cosigning: boolean;
    lastDate: number;
    loaded: Array<{ ts: wasm.ReducedTransaction, commitments: Array<Array<string>>, boxes: wasm.ErgoBoxes }>;
    connector?: CoSigningCommunication;
    timeout?: NodeJS.Timeout;
    creating: boolean;
    cosigningRows: Array<SignRow>;
    addresses: Array<string>;
}

interface InputData {
    tx: string;
    boxes: Array<string>;
    commitments: Array<Array<string>>;
}

interface SignRow {
    id: string,
    tx: wasm.ReducedTransaction;
    boxes: wasm.ErgoBoxes;
    boxArray: Array<wasm.ErgoBox>;
    creator: string;
}

class MultiSigCommunication extends React.Component<MultiSigCommunicationPropsType, MultiSigCommunicationStateType> {
    state: MultiSigCommunicationStateType = {
        commitment: [],
        boxes: wasm.ErgoBoxes.empty(),
        cosigning: true,
        loaded: [],
        lastDate: 0,
        creating: false,
        cosigningRows: [],
        addresses: [],
    };

    createConnector = () => {
        if (!this.state.connector && !this.state.creating) {
            this.setState({ creating: true });
            MultiSigDbAction.getBaseAddress(this.props.wallet.id).then(address => {
                if (address) {
                    const connector = new CoSigningCommunication(address);
                    this.setState({ connector: connector, creating: false });
                } else {
                    // this.setState({ error: 'related wallet not found!!' });
                }
            });
        }
    };

    componentDidMount = () => {
        this.props.setTab('send');
        this.pullCoSign().then(() => null);
        AddressDbAction.getWalletAddresses(this.props.wallet.id).then((addresses) => {
            this.setState({ addresses: addresses.map(item => item.address) });
        });
    };

    componentWillUnmount = () => {
        if (this.state.timeout) {
            try {
                clearTimeout(this.state.timeout);
            } catch (e) {
            }
        }
    };

    componentDidUpdate = () => {
        this.createConnector();
    };

    newDataReceived = (newData: string) => {
        try {
            const data: InputData = JSON.parse(newData) as InputData;
            const tx = wasm.ReducedTransaction.sigma_parse_bytes(Uint8Array.from(Buffer.from(data.tx!, 'base64')));
            const boxes = wasm.ErgoBoxes.empty();
            data.boxes.map(item => wasm.ErgoBox.sigma_parse_bytes(Uint8Array.from(Buffer.from(item, 'base64')))).forEach(box => boxes.add(box));
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

    pullCoSign = async () => {
        if (this.state.cosigning && this.state.connector) {
            this.state.connector.fetchMessage('create').then(messages => {
                const stateMessage: Array<SignRow> = messages.map(item => {
                    try {
                        const msgJson: { tx: string, boxes: Array<string> } = JSON.parse(item.message);
                        const tx = wasm.ReducedTransaction.sigma_parse_bytes(Uint8Array.from(Buffer.from(msgJson.tx, 'base64')));
                        const boxes = wasm.ErgoBoxes.empty();
                        const boxArray = msgJson.boxes.map(boxItem => {
                            const box = wasm.ErgoBox.sigma_parse_bytes(Uint8Array.from(Buffer.from(boxItem, 'base64')));
                            boxes.add(box);
                            return box;
                        });
                        return {
                            id: tx.unsigned_tx().id().to_str(),
                            tx: tx,
                            boxes: boxes,
                            boxArray: boxArray,
                            creator: item.sender,
                        };
                    } catch (e) {
                        return undefined;
                    }
                }).filter(item => item).map(item => item!);
                this.setState(state => ({
                    ...state,
                    cosigningRows: [...state.cosigningRows, ...stateMessage],
                }));
            });
        }
        const timeout = setTimeout(() => this.pullCoSign().then(() => null), 5000);
        this.setState({ timeout: timeout });
    };

    deleteIndexCosigningRow = (index: number) => {
        this.setState(state => {
            const newState = { ...state };
            newState.cosigningRows = [...newState.cosigningRows];
            newState.cosigningRows.splice(index, 1);
            return newState;
        });
    };

    render = () => {
        return (
            <WithAppBar header={<AppHeader title='Multi Sig' hideQrCode={true} />}>
                {this.state.tx ? (
                    <MultiSigSignProcess
                        wallet={this.props.wallet}
                        commitments={this.state.commitment}
                        tx={this.state.tx}
                        init={false}
                        boxes={this.state.boxes}
                        close={() => this.setState({ commitment: [], boxes: wasm.ErgoBoxes.empty(), tx: undefined })}
                    />
                ) : (
                    <Container style={{ marginTop: 20 }}>
                        <Grid container>
                            <MultiSigDataReader newData={(data: string) => this.newDataReceived(data)} />
                        </Grid>
                    </Container>
                )}
                <br />
                <Divider />
                <Container>
                    <Grid container textAlign='center'>
                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch
                                        value={this.state.cosigning}
                                        onChange={(event) => this.setState({ cosigning: event.target.checked })} />}
                                    label='Enable CoSigning Server Messaging' />
                            </FormGroup>
                        </Grid>
                    </Grid>
                </Container>
                <Container>
                    <Grid container>
                        <Grid item xs={12}>
                            {this.state.cosigningRows.map((item, index) => (
                                <Paper elevation={0} key={index} style={{ paddingBottom: 16 }}>
                                    <TxView
                                        network_type={this.props.wallet.network_type}
                                        tx={item.tx.unsigned_tx()}
                                        boxes={item.boxArray}
                                        addresses={this.state.addresses}
                                    />
                                    <Divider />

                                    <MultiSigSignProcess
                                        wallet={this.props.wallet}
                                        commitments={[]}
                                        tx={item.tx}
                                        init={false}
                                        cosigning={true}
                                        boxes={item.boxes}
                                        close={() => this.deleteIndexCosigningRow(index)}
                                    />
                                </Paper>
                            ))}
                        </Grid>
                    </Grid>
                </Container>
            </WithAppBar>
        );
    };
}

const mapStateToProps = (state: GlobalStateType) => ({});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSigCommunication);
