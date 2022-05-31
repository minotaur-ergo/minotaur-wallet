import React from 'react';
import { MessageEnqueueService } from '../app/MessageHandler';
import Wallet from '../../db/entities/Wallet';
import { GlobalStateType } from '../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { AddQrCodeOpened, closeQrCodeScanner, showMessage } from '../../store/actions';
import { SnackbarMessage, VariantType } from 'notistack';
import { Alert, Button, Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import * as wasm from 'ergo-lib-wasm-browser';
import { MultiSigAction } from '../../action/action';
import { AddressDbAction, MultiSigDbAction } from '../../action/db';
import RenderPassword from './RenderPassword';
import ShareCommitmentMultiSig from './ShareCommitmentMultiSig';
import { getNetworkType, NETWORK_TYPES } from '../../util/network_type';
import { PUBLISH_MANUAL_TYPES } from './PublishManualType';
import { BlockChainAction } from '../../action/blockchain';
import MultiSigDataReader from './MultiSigDataReader';
import ShareTransactionMultiSig from './ShareTransactionMultiSig';
import PublishedTxView from '../PublishedTxView';
import { CoSigningCommunication } from '../../action/cosigning';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import DisplayId from '../display-id/DisplayId';
import AddressStatusDisplay from './AddressStatusDisplay';

interface MultiSigSignProcessPropsType extends MessageEnqueueService {
    close: () => any;
    wallet: Wallet;
    tx: wasm.ReducedTransaction,
    boxes: wasm.ErgoBoxes,
    wallets: Array<Wallet>;
    commitments?: Array<Array<string>>;
    init: boolean;
    cosigning?: boolean;
}

interface MultiSigSignProcessStatesType {
    password: string;
    txId: string;
    loading: boolean;
    txBytes: string;
    boxes: Array<string>;
    myHints?: {
        own: wasm.TransactionHintsBag;
        known: wasm.TransactionHintsBag;
    };
    commitments: Array<Array<string>>;
    error: string;
    relatedWallet?: Wallet;
    publishType: PUBLISH_MANUAL_TYPES;
    partial?: string;
    partialTx?: wasm.Transaction;
    simulated?: Array<string>;
    signed?: Array<string>;
    mySign: boolean;
    propsLoaded: boolean;
    qrCode: string;
    publishedId: string;
    cosigning: boolean;
    connector?: CoSigningCommunication;
    timeout?: NodeJS.Timeout;
    addresses: Array<{ address: string, pk: string }>;
    baseAddress: string;
    commitmentSend: boolean;
    firstInputPk: string;
    firstInputPks: Array<string>;
}

interface InputData {
    tx: string;
    boxes: Array<string>;
    commitments: Array<Array<string>>;
    signed?: Array<string>;
    simulated?: Array<string>;
    partialTx?: string;
}

class MultiSigSignProcess extends React.Component<MultiSigSignProcessPropsType, MultiSigSignProcessStatesType> {
    state: MultiSigSignProcessStatesType = {
        password: '',
        error: '',
        txId: '',
        txBytes: '',
        commitments: [],
        boxes: [],
        loading: false,
        publishType: PUBLISH_MANUAL_TYPES.clipboard,
        mySign: false,
        propsLoaded: false,
        qrCode: '',
        publishedId: '',
        cosigning: false,
        addresses: [],
        baseAddress: '',
        commitmentSend: false,
        firstInputPk: '',
        firstInputPks: [],
    };

    updateTransaction = async () => {
        const tx = this.props.tx;
        const txId = tx.unsigned_tx().id().to_str();
        if (this.state.txId !== txId && !this.state.loading) {
            this.setState({ loading: true });
            const txBytes = Buffer.from(tx.sigma_serialize_bytes()).toString('base64');
            const boxes = Array(this.props.boxes.len()).fill('').map((item, index) => {
                return Buffer.from(this.props.boxes.get(index).sigma_serialize_bytes()).toString('base64');
            });
            this.setState({
                txId: txId,
                boxes: boxes,
                txBytes: txBytes,
                loading: false,
            });
        }
    };

    updateCommitments = async (newCommitments?: Array<Array<string>>) => {
        let commitments = this.state.commitments.map(item => [...item]);
        let changed: boolean = false;
        if (this.props.commitments && !this.state.propsLoaded) {
            const override = MultiSigAction.overridePublicCommitments(commitments, this.props.commitments);
            commitments = override.commitments;
            changed = changed ? changed : override.changed;
        }
        if (newCommitments) {
            const override = MultiSigAction.overridePublicCommitments(commitments, newCommitments);
            commitments = override.commitments;
            changed = changed ? changed : override.changed;
        }
        if (this.state.myHints && !this.state.mySign) {
            const known = await this.getKnownCommitments(this.state.myHints.known);
            const overrideKnown = MultiSigAction.overridePublicCommitments(commitments, known);
            commitments = overrideKnown.commitments;
            changed = changed ? changed : overrideKnown.changed;
        }
        if (changed) {
            this.setState({
                commitments: commitments,
                propsLoaded: true,
            });
        }
    };

    updateQrCode = async () => {
        const tx = this.state.txBytes;
        const boxes = JSON.stringify(this.state.boxes);
        const commitments = JSON.stringify(this.state.commitments);
        let res = `{"tx":"${tx}","boxes":${boxes},"commitments":${commitments}`;
        if (this.state.partial) {
            const partial = this.state.partial;
            const simulated = JSON.stringify(await this.getSimulated());
            const signed = JSON.stringify(this.state.signed);
            res += `,"simulated":${simulated},"signed":${signed},"partialTx":"${partial}"`;
        }
        res += '}';
        if (this.state.qrCode !== res) {
            this.setState({ qrCode: res });
        }
    };

    getInputMap = async (): Promise<{ [boxId: string]: string }> => {
        const networkPrefix = getNetworkType(this.props.wallet.network_type).prefix;
        return Object.assign({}, ...Array(
            this.props.boxes.len(),
        ).fill('').map((item, index) => {
            const box = this.props.boxes.get(index);
            const address = wasm.Address.recreate_from_ergo_tree(box.ergo_tree()).to_base58(networkPrefix);
            return { [box.box_id().to_str()]: address };
        }));
    };

    getBaseAddressMapOrderedForFirstInput = async (relatedWallet: Wallet) => {
        const networkPrefix = getNetworkType(this.props.wallet.network_type).prefix;
        const first_box_id = this.props.tx.unsigned_tx().inputs().get(0).box_id().to_str();
        const first_box = Array(this.props.boxes.len()).fill(0).map((item, index) => this.props.boxes.get(index)).filter(item => item.box_id().to_str() === first_box_id)[0];
        const first_box_address = wasm.Address.recreate_from_ergo_tree(first_box.ergo_tree()).to_base58(networkPrefix);
        const address = await AddressDbAction.getAddressByAddressString(first_box_address);
        return await MultiSigAction.getAddressMapForIndex(this.props.wallet, relatedWallet, address?.idx ? address.idx : 0, networkPrefix);
    };

    getInputPks = async (): Promise<Array<Array<string>>> => {
        if (this.props.wallet && this.state.relatedWallet) {
            const pks = await MultiSigAction.getMultiSigWalletPublicKeys(this.props.wallet, this.state.relatedWallet);
            const tx = this.props.tx;
            const inputMap = await this.getInputMap();
            return Array(tx.unsigned_tx().inputs().len()).fill('').map((item, index) => {
                return tx.unsigned_tx().inputs().get(index);
            }).map(box => inputMap[box.box_id().to_str()]).map(address => ([...pks[address]]));
        }
        return [];
    };

    getMyInputPks = async (): Promise<Array<string>> => {
        if (this.props.wallet && this.state.relatedWallet) {
            const pks = await MultiSigAction.getMultiSigWalletMyPublicKeys(this.props.wallet, this.state.relatedWallet);
            const tx = this.props.tx;
            const inputMap = await this.getInputMap();
            return Array(tx.unsigned_tx().inputs().len()).fill('').map((item, index) => {
                return tx.unsigned_tx().inputs().get(index);
            }).map(box => inputMap[box.box_id().to_str()]).map(address => (pks[address]));
        }
        return [];
    };

    getKnownCommitments = async (commitment: wasm.TransactionHintsBag) => {
        const inputPKs = await this.getInputPks();
        return MultiSigAction.commitmentToByte(commitment, inputPKs);
    };

    commitmentCount = () => {
        if (this.state.commitments.length === 0) {
            return 0;
        }
        return Math.min(...this.state.commitments.map(boxCommitments => boxCommitments.filter(item => !!item).length));
    };

    unsignedCommitments = () => {
        if (this.state.commitments.length === 0) {
            return 0;
        }
        if(this.state.signed !== undefined) {
            return this.state.commitments[0].filter((item, index) => !!item && this.state.signed?.indexOf(this.state.firstInputPks[index])! === -1).length;
        }
        return this.commitmentCount()
    };

    acceptPassword = async (password: string, useCosigning: boolean) => {
        if (this.state.relatedWallet) {
            if (this.commitmentCount() + (this.state.myHints ? 0 : 1) >= parseInt(this.props.wallet.seed) && !this.state.connector) {
                await this.signTx(password);
            } else {
                await this.addCommitments(password, useCosigning);
            }
        }
    };

    createConnector = async (sendData: boolean) => {
        const address = await MultiSigDbAction.getBaseAddress(this.props.wallet.id);
        if (address) {
            const connector = new CoSigningCommunication(address);
            this.setState({
                connector: connector,
                baseAddress: address,
            });
            if (sendData) {
                MultiSigDbAction.getOtherAddresses(this.props.wallet.id).then(addresses => {
                    const message = {
                        tx: this.state.txBytes,
                        boxes: this.state.boxes,
                    };
                    connector.putMessage('create', JSON.stringify(message), addresses);
                });
            }
            this.connectorWatch().then(() => null);
            return connector;
        } else {
            // this.setState({ error: 'related wallet not found!!' });
        }
    };

    addCommitments = async (password: string, useCosigning: boolean) => {
        if (this.state.relatedWallet) {
            if (!this.state.myHints) {
                const tx = this.props.tx;
                const wallet = await MultiSigAction.getMultiSigWalletProver(this.props.wallet, this.state.relatedWallet, password);
                const commitment = await MultiSigAction.generateCommitments(wallet, tx);
                const known = await this.getKnownCommitments(commitment.public);
                if (this.props.init && useCosigning) {
                    this.createConnector(true).then(connector => null);
                }
                this.setState(state => {
                    const updateDict = {
                        ...state,
                        password: password,
                        cosigning: useCosigning,
                        myHints: {
                            own: commitment.private,
                            known: commitment.public,
                        },
                    };
                    const commitments = state.commitments;
                    if (commitments.length !== known.length) {
                        return { ...updateDict, commitments: known };
                    }
                    const finalCommitments = MultiSigAction.overridePublicCommitments(commitments, known);
                    return { ...updateDict, commitments: finalCommitments.commitments };
                });
            }
        }
    };

    getSimulated = async (): Promise<Array<string>> => {
        if (this.state.simulated)
            return this.state.simulated;
        const myPks = await this.getMyInputPks();
        const inputPks = await this.getInputPks();
        const res: Array<string> = [];
        inputPks.forEach((pkRow, rowIndex) => {
            const commitments = this.state.commitments[rowIndex];
            pkRow.forEach((pk, pkIndex) => {
                if (!commitments[pkIndex] && myPks.indexOf(pk) === -1) {
                    res.push((pk));
                }
            });
        });
        return res;
    };

    removeSignedCommitments = (publicKeys: Array<Array<string>>, myPKs: Array<string>) => {
        return this.state.commitments.map((commitmentRow, rowIndex) => {
            const rowPks = publicKeys[rowIndex];
            return commitmentRow.map((commitment, pkIndex) => {
                const pk = rowPks[pkIndex];
                if (this.state.signed?.indexOf(pk)! >= 0 || myPKs.indexOf(pk) >= 0) {
                    return '';
                }
                return commitment;
            });
        });
    };

    signTx = async (password: string) => {
        if (this.state.relatedWallet) {
            const simulated = await this.getSimulated();
            const publicKeys = await this.getInputPks();
            const myPks = await this.getMyInputPks();
            const commitments = this.removeSignedCommitments(publicKeys, myPks);
            const publicHintBag = MultiSigAction.getHintBags(publicKeys, commitments);
            if (this.state.signed && this.state.signed.length > 0) {
                const simulatedPropositions = new wasm.Propositions();
                simulated.forEach(item => {
                    simulatedPropositions.add_proposition_from_byte(Uint8Array.from(Buffer.from('cd' + item, 'hex')));
                });
                const realPropositions = new wasm.Propositions();
                this.state.signed.forEach(item => {
                    realPropositions.add_proposition_from_byte(Uint8Array.from(Buffer.from('cd' + item, 'hex')));
                });
                const context = await BlockChainAction.createContext(this.state.relatedWallet.network_type);
                const partial = this.state.partialTx ? this.state.partialTx : wasm.Transaction.sigma_parse_bytes(Buffer.from(this.state.partial!, 'base64'));
                const hints = wasm.extract_hints(
                    partial,
                    context,
                    this.props.boxes,
                    wasm.ErgoBoxes.empty(),
                    realPropositions,
                    simulatedPropositions,
                );
                Array(this.props.tx.unsigned_tx().inputs().len()).fill('').forEach((item, index) => {
                    const inputHints = hints.all_hints_for_input(index);
                    publicHintBag.add_hints_for_input(index, inputHints);
                    if (this.state.myHints) {
                        const myOwnInputHints = this.state.myHints.own.all_hints_for_input(index);
                        publicHintBag.add_hints_for_input(index, myOwnInputHints);
                    }
                });
            }
            const tx = this.props.tx;
            const wallet = await MultiSigAction.getMultiSigWalletProver(this.props.wallet, this.state.relatedWallet, password);
            let partial = '';
            const partialSigned = wallet.sign_reduced_transaction_multi(tx, publicHintBag);
            partial = Buffer.from(partialSigned.sigma_serialize_bytes()).toString('base64');
            this.setState({
                simulated: simulated,
                signed: [...myPks, ...(this.state.signed ? this.state.signed : [])],
                partial: partial,
                mySign: true,
                commitments: commitments,
            });
            if (this.state.connector) {
                // send sign to other signers
                const msg = {
                    type: 'sign',
                    simulated: simulated,
                    signed: [...myPks, ...(this.state.signed ? this.state.signed : [])],
                    partial: partial,
                };
                this.publishMessage(JSON.stringify(msg));
            }
        }
    };

    loadJson = (jsonStr: string) => {
        try {
            const data: InputData = JSON.parse(jsonStr) as InputData;
            if (data.hasOwnProperty('partialTx')) {
                if (data.tx === this.state.txBytes) {
                    const partial = wasm.Transaction.sigma_parse_bytes(Uint8Array.from(Buffer.from(data.partialTx!, 'base64')));
                    this.setState({
                        commitments: data.commitments,
                        signed: data.signed!,
                        partialTx: partial,
                        simulated: data.simulated!,
                        mySign: false,
                    });
                } else {
                    this.props.showMessage('Invalid Data entered', 'error');
                }
            } else {
                if (data.tx === this.state.txBytes) {
                    this.updateCommitments(data.commitments).then(() => null);
                } else {
                    this.props.showMessage('Invalid Data entered', 'error');
                }
            }
        } catch (e) {
            this.props.showMessage('Invalid data entered', 'error');
        }
    };

    publishTx = () => {
        if (this.state.partial) {
            const tx = wasm.Transaction.sigma_parse_bytes(Uint8Array.from(Buffer.from(this.state.partial, 'base64')));
            getNetworkType(this.state.relatedWallet?.network_type!).getNode().sendTx(tx).then(res => {
                this.setState({ publishedId: res.txId });
            });
        }
    };

    publishMessage = (message: string) => {
        const receivers = this.state.addresses.map(item => item.address).filter(item => item !== this.state.baseAddress);
        this.state.connector?.putMessage(this.state.txId, message, receivers).then(() => null);
    };

    updateData = () => {
        if (!this.state.relatedWallet) {
            MultiSigDbAction.getWalletInternalKey(this.props.wallet.id).then(wallet => {
                if (wallet) {
                    this.getBaseAddressMapOrderedForFirstInput(wallet).then(addresses => {
                        this.setState({ relatedWallet: wallet, addresses: addresses });
                    });
                } else {
                    this.setState({ error: 'related wallet not found!!' });
                }
            });
        }
        if (this.state.connector && this.state.myHints && !this.state.commitmentSend) {
            this.getKnownCommitments(this.state.myHints.known).then(commitments => {
                const msg = {
                    type: 'commitment',
                    commitments: commitments,
                };
                this.publishMessage(JSON.stringify(msg));
                this.setState({ commitmentSend: true });
            });
        }
        this.updateTransaction().then(() => null);
        this.updateCommitments().then(() => null);
        this.updateQrCode().then(() => null);
    };

    componentDidMount = () => {
        this.updateData();
        if (!this.props.init && this.props.cosigning) {
            this.createConnector(false).then(connector => null);
        }
    };

    connectorWatch = async () => {
        let stateChanges = {};
        let firstInputPks = [...this.state.firstInputPks];
        let firstInputPksChanged = false;
        if (firstInputPks.length === 0) {
            const pks = await this.getInputPks();
            if (pks.length > 0) {
                firstInputPks = pks[0];
                firstInputPksChanged = true;
            }
        }
        const myFirstInputPk = (await this.getMyInputPks())[0];
        if (this.state.connector && !this.state.publishedId) {
            this.state.connector.fetchMessage(this.state.txId).then(res => {
                let commitments = [...this.state.commitments];
                let commitmentChanged = false;
                const bestSign: { signed: Array<string>, simulated: Array<string>, partial: string, count: number } = {
                    signed: this.state.signed ? [...this.state.signed] : [],
                    simulated: this.state.simulated ? [...this.state.simulated] : [],
                    partial: this.state.partial ? this.state.partial : '',
                    count: this.state.signed ? firstInputPks.filter(item => this.state.signed?.indexOf(item)! >= 0 && item !== this.state.firstInputPk).length : 0,
                };
                res.forEach((row) => {
                    const data = JSON.parse(row.message);
                    if (data.type === 'commitment') {
                        const override = MultiSigAction.overridePublicCommitments(commitments, data.commitments as Array<Array<string>>);
                        commitments = override.commitments;
                        commitmentChanged = commitmentChanged || override.changed;
                    } else {
                        const signed: Array<string> = data.signed;
                        const simulated: Array<string> = data.simulated;
                        const partial: string = data.partial;
                        const count = firstInputPks.filter(item => data.signed.indexOf(item) >= 0 && item !== this.state.firstInputPk).length;
                        if (count > bestSign.count) {
                            bestSign.signed = signed;
                            bestSign.simulated = simulated;
                            bestSign.partial = partial;
                            bestSign.count = count;
                        }
                    }
                });
                if (commitmentChanged) {
                    stateChanges = { ...stateChanges, commitments: commitments };
                }
                if (this.state.partial && bestSign.partial !== this.state.partial) {
                    const partialTx = wasm.Transaction.sigma_parse_bytes(Uint8Array.from(Buffer.from(bestSign.partial, 'base64')));
                    stateChanges = {
                        ...stateChanges,
                        signed: bestSign.signed,
                        partialTx: partialTx,
                        simulated: bestSign.simulated,
                        mySign: bestSign.signed.indexOf(this.state.firstInputPk) >= 0,
                    };
                }
                this.setState(stateChanges);
            });
            const totalCommitments = this.commitmentCount() + this.totalSigned();
            if (totalCommitments >= parseInt(this.props.wallet.seed)) {
                // process signing data
                if (!this.state.signed || this.state.signed.indexOf(this.state.firstInputPk) < 0) {
                    // need to be signed with me
                    this.signTx(this.state.password).then(() => null);
                }
            }
            if (this.totalSigned() > 0 && this.unsignedCommitments() === 0) {
                this.publishTx();
            } else {
                console.log(this.totalSigned(), this.unsignedCommitments());
            }
        }
        const timeout = setTimeout(() => this.connectorWatch().then(() => null), 5000);
        if (firstInputPksChanged) {
            this.setState({ firstInputPks: firstInputPks, timeout: timeout, firstInputPk: myFirstInputPk });
        } else {
            this.setState({ timeout: timeout });
        }
    };

    totalSigned = () => {
        if (this.state.firstInputPks)
            return this.state.firstInputPks.filter(item => this.state.signed ? this.state.signed.indexOf(item) >= 0 : false).length;
        return 0;
    };

    componentDidUpdate = () => {
        this.updateData();
    };

    getNetworkType = () => {
        if (this.state.relatedWallet) {
            return getNetworkType(this.state.relatedWallet?.network_type);
        }
        return NETWORK_TYPES[0];
    };

    render = () => {
        return (
            <Container>
                {this.state.connector ? (
                    <Grid container spacing={2} style={{ textAlign: 'center' }}>
                        {this.state.publishedId ? (
                            <PublishedTxView txId={this.state.publishedId} networkType={this.getNetworkType()} />
                        ) : this.state.password ? (
                            <Grid item xs={12}>
                                <List>
                                    {this.state.addresses.map((address, index) => (
                                        <ListItem key={address.address}>
                                            <ListItemText
                                                primary={<DisplayId id={address.address} />}
                                                secondary={<AddressStatusDisplay
                                                    commitment={this.state.commitments[0][index] !== '' ? true : this.state.signed ? this.state.signed.indexOf(address.pk) >= 0 : false}
                                                    sign={this.state.signed ? this.state.signed.indexOf(address.pk) >= 0 : false} />}
                                            />
                                        </ListItem>
                                    ))}
                                    <ListItem>
                                        <ListItemText>Total Signed: {this.totalSigned()}</ListItemText>
                                    </ListItem>
                                </List>
                            </Grid>
                        ) : (
                            <RenderPassword
                                selectCosigning={this.props.init}
                                accept={(password, useCosigning) => this.acceptPassword(password, useCosigning)}
                                wallet={this.state.relatedWallet!} />

                        )}
                    </Grid>
                ) : (
                    <Grid container spacing={2} style={{ textAlign: 'center' }} marginTop={3}>
                        {
                            this.state.error ? (
                                <Alert severity='error'>
                                    An error occurred: {this.state.error}
                                </Alert>
                            ) : this.state.publishedId ? (
                                <PublishedTxView txId={this.state.publishedId} networkType={this.getNetworkType()} />
                            ) : this.state.mySign ? (
                                <ShareTransactionMultiSig
                                    remainCount={this.commitmentCount()}
                                    required={parseInt(this.props.wallet.seed)}
                                    publishTx={() => this.publishTx()}
                                    commitment={this.state.qrCode} />
                            ) : this.state.partialTx ? (
                                <Grid xs={12} item>
                                    <Button variant='contained' fullWidth color='primary'
                                            onClick={() => this.signTx(this.state.password)}>
                                        Process Sign transaction
                                    </Button>
                                </Grid>
                            ) : this.state.myHints ? (
                                <ShareCommitmentMultiSig
                                    count={this.commitmentCount()}
                                    required={parseInt(this.props.wallet.seed)}
                                    commitment={this.state.qrCode} />
                            ) : (
                                <RenderPassword
                                    selectCosigning={this.props.init}
                                    accept={(password, useCosigning) => this.acceptPassword(password, useCosigning)}
                                    wallet={this.state.relatedWallet!} />
                            )
                        }
                        {this.state.mySign ? (
                            <Grid xs={12} item>
                                <Button variant='contained' fullWidth color='primary'
                                        onClick={() => this.props.close()}>
                                    Completed
                                </Button>
                            </Grid>
                        ) : !!this.state.partial || !this.state.myHints ? null : (
                            <Grid xs={12} item>
                                <MultiSigDataReader newData={(data: string) => this.loadJson(data)} />
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>
        );
    };
}

const mapStateToProps = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets,
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    addQrcode: (id: string) => dispatch(AddQrCodeOpened(id)),
    closeQrCode: (id: string) => dispatch(closeQrCodeScanner(id)),
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiSigSignProcess);
