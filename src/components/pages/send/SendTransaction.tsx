import React from 'react';
import ReceiverRow from './ReceiverRow';
import AddressSelector from './AddressSelector';
import Address from '../../../db/entities/Address';
import { BlockChainAction, Receiver } from '../../../action/blockchain';
import TokenWithAddress from '../../../db/entities/views/AddressToken';
import ReceiverRowCard from './ReceiverRowCard';
import { UnsignedGeneratedTx, WalletPagePropsType } from '../../../util/interface';
import { Button, Container, Grid } from '@mui/material';
import { FEE } from '../../../util/const';
import InAdvancedMode from '../../display-view/InAdvancedMode';
import { GlobalStateType } from '../../../store/reducer';
import { connect, MapDispatchToProps } from 'react-redux';
import { SnackbarMessage, VariantType } from 'notistack';
import { showMessage } from '../../../store/actions';
import { MessageEnqueueService } from '../../app/MessageHandler';
import GenerateTransactionBottomSheet from '../../generate-transaction-bottom-sheet/GenerateTransactionBottomSheet';
import InSimpleMode from '../../display-view/InSimpleMode';
import { AddressDbAction, BoxContentDbAction } from '../../../action/db';
import { DisplayType } from '../../../store/reducer/wallet';
import { Link } from 'react-router-dom';
import { getRoute, RouteMap } from '../../route/routerMap';
import { WalletType } from '../../../db/entities/Wallet';

interface SendTransactionPropsType extends WalletPagePropsType, MessageEnqueueService {
    display: DisplayType;
}

interface SendTransactionStateType {
    receivers: Array<Receiver>;
    totalErg: bigint;
    showModal: boolean;
    selectedAddress: Array<Address> | null | undefined;
    availableTokens: Array<TokenWithAddress>;
    generatedTx?: UnsignedGeneratedTx;
}

const getAddressId = (address: Address | null | undefined) => {
    if (address) {
        return address.id;
    }
    return address;
};

class SendTransaction extends React.Component<SendTransactionPropsType, SendTransactionStateType> {
    state: SendTransactionStateType = {
        receivers: [new Receiver('3WwqqWWYoMieDXBJfyt8UbYp91Uepa9fh2eSRk2eRW1URyKYxqzv', '1')],
        totalErg: BigInt(0),
        showModal: false,
        availableTokens: [],
        selectedAddress: undefined,
        generatedTx: undefined,
    };

    updateReceivers = (index: number, receiver: Receiver) => {
        let newReceivers: Array<Receiver> = [...this.state.receivers];
        newReceivers[index] = receiver;
        this.setState({ receivers: newReceivers });
    };

    addReceiver = () => {
        this.setState(state => ({ ...state, receivers: [...state.receivers, new Receiver('', '')] }));
    };

    deleteReceiver = (index: number) => {
        let newReceivers = [...this.state.receivers];
        newReceivers.splice(index, 1);
        this.setState({ receivers: newReceivers });
    };

    updateTotalParams = async () => {
        if (this.props.display === 'simple') {
            const totalErg = (await AddressDbAction.getWalletAddressesWithErg(this.props.wallet.id)).map(item => item.erg()).reduce((a, b) => a + b, BigInt(0));
            const tokens = await BoxContentDbAction.getTokenWithAddressForWallet(this.props.wallet.id);
            this.setParams(totalErg, null, tokens);
        }
    };

    checkAddressesEqual = (addrList1: Array<Address> | undefined | null, addrList2: Array<Address> | undefined | null) => {
        if (addrList1 && addrList2) {
            if (addrList1.length !== addrList2.length) return false;
            return addrList1.filter((item, index) => getAddressId(item) !== getAddressId(addrList2[index])).length === 0;
        }
        return addrList1 === addrList2;
    };

    setParams = (amount: bigint, address: Array<Address> | null, tokens: Array<TokenWithAddress>) => {
        if (!this.checkAddressesEqual(address, this.state.selectedAddress)) {
            this.setState({
                selectedAddress: address,
                totalErg: amount,
                availableTokens: tokens,
            });
        }
    };
    closeModal = () => this.setState({ showModal: false });

    generateAndSendTx = async () => {
        try {
            const tx = await BlockChainAction.createTx(this.state.receivers, this.props.wallet, this.state.selectedAddress ? this.state.selectedAddress : undefined);
            this.setState({
                showModal: true,
                generatedTx: tx,
            });
        } catch (e) {
            this.props.showMessage(`${e}`, 'error');
        }
    };

    componentDidMount() {
        this.props.setTab('send');
        this.updateTotalParams().then(() => null);
    }

    renderSendButton = () => {
        const isValid = this.state.receivers.filter((item: Receiver) => !item.valid()).length === 0;
        const validAddress = this.state.selectedAddress === undefined || this.state.selectedAddress === null || this.state.selectedAddress.length > 0;
        return (
            <Button
                variant='contained'
                fullWidth
                color='primary'
                onClick={this.generateAndSendTx}
                disabled={!isValid || !validAddress}>
                Send
            </Button>
        );
    };

    render = () => {
        return (
            <React.Fragment>
                <Container style={{ marginTop: 20 }}>
                    <Grid container spacing={3}>
                        <InAdvancedMode>
                            <Grid item xs={12}>
                                <AddressSelector setParams={this.setParams} wallet={this.props.wallet} />
                            </Grid>
                        </InAdvancedMode>
                        {this.state.receivers.map((receiver: Receiver, index: number) => (
                            <Grid item xs={12} key={`sender-${index}`}>
                                <ReceiverRowCard
                                    delete={() => this.deleteReceiver(index)}
                                    showDelete={this.state.receivers.length > 1}>
                                    <ReceiverRow
                                        tokens={this.state.availableTokens}
                                        remaining={this.state.totalErg - FEE}
                                        value={receiver}
                                        network_type={this.props.wallet.network_type}
                                        setValue={param => this.updateReceivers(index, param)} />
                                </ReceiverRowCard>
                            </Grid>
                        ))}
                        <InAdvancedMode>
                            <Grid item xs={6}>
                                <Button
                                    variant='contained'
                                    fullWidth
                                    color='primary'
                                    onClick={this.addReceiver}>
                                    Add Receiver
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                {this.renderSendButton()}
                            </Grid>
                        </InAdvancedMode>
                        <InSimpleMode>
                            <Grid item xs={12}>
                                {this.renderSendButton()}
                            </Grid>
                        </InSimpleMode>
                        {this.props.wallet.type === WalletType.MultiSig ? (
                            <Grid item xs={12}>
                                <Link to={getRoute(RouteMap.WalletMultiSig, { id: this.props.wallet.id })}>
                                    Goto Multi-sig Communication page
                                </Link>
                            </Grid>
                        ) : null}
                    </Grid>
                </Container>
                <GenerateTransactionBottomSheet
                    transaction={this.state.generatedTx}
                    show={this.state.showModal}
                    close={this.closeModal}
                    wallet={this.props.wallet} />
            </React.Fragment>
        );
    };
}

const mapStateToProps = (state: GlobalStateType) => ({
    display: state.wallet.display,
});

const mapDispatchToProps = (dispatch: MapDispatchToProps<any, any>) => ({
    showMessage: (message: SnackbarMessage, variant: VariantType) => dispatch(showMessage(message, variant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendTransaction);
