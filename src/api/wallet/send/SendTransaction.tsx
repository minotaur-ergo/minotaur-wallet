import React from "react";
import { Button, Container, Grid } from "@material-ui/core";
import ReceiverRow from "./ReceiverRow";
import AddressSelector from "./AddressSelector";
import Address from "../../../db/entities/Address";
import { createTx, Receiver } from "../../../action/blockchain";
import { UnsignedGeneratedTx, WalletPagePropsType } from "../../../utils/interface";
import { FEE } from "../../../config/const";
import TokenWithAddress from "../../../db/entities/views/AddressToken";
import GenerateTransactionBottomSheet from "../../../components/GenerateTransactionBottomSheet";
import { show_notification } from "../../../utils/utils";
import ReceiverRowCard from "./ReceiverRowCard";

interface StateType {
    receivers: Array<Receiver>;
    totalErg: bigint;
    showModal: boolean;
    selectedAddress: Array<Address> | null | undefined;
    availableTokens: Array<TokenWithAddress>;
    generatedTx?: UnsignedGeneratedTx
}

const getAddressId = (address: Address | null | undefined) => {
    if (address) {
        return address.id;
    }
    return address;
};

class SendTransaction extends React.Component<WalletPagePropsType, StateType> {
    state: StateType = {
        receivers: [new Receiver("", "")],
        totalErg: BigInt(0),
        showModal: false,
        availableTokens: [],
        selectedAddress: undefined,
        generatedTx: undefined
    };

    updateReceivers = (index: number, receiver: Receiver) => {
        let newReceivers: Array<Receiver> = [...this.state.receivers];
        newReceivers[index] = receiver;
        this.setState({ receivers: newReceivers });
    };

    addReceiver = () => {
        this.setState(state => ({ ...state, receivers: [...state.receivers, new Receiver("", "")] }));
    };

    deleteReceiver = (index: number) => {
        let newReceivers = [...this.state.receivers];
        newReceivers.splice(index, 1);
        this.setState({ receivers: newReceivers });
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
                availableTokens: tokens
            });
        }
    };
    closeModal = () => this.setState({ showModal: false });

    generateAndSendTx = async () => {
        try {
            const tx = await createTx(this.state.receivers, this.props.wallet, this.state.selectedAddress ? this.state.selectedAddress : undefined);
            this.setState({
                showModal: true,
                generatedTx: tx
            });
        } catch (e) {
            show_notification(e);
        }
    };

    componentDidMount() {
        this.props.setTab("send");
    }

    render = () => {
        const isValid = this.state.receivers.filter((item: Receiver) => !item.valid()).length === 0;
        const validAddress = this.state.selectedAddress === undefined || this.state.selectedAddress === null || this.state.selectedAddress.length > 0;
        return (
            <React.Fragment>
                <Container style={{ marginTop: 20 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <AddressSelector setParams={this.setParams} wallet={this.props.wallet} />
                        </Grid>
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
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                color="primary"
                                onClick={this.addReceiver}>
                                Add Receiver
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                color="primary"
                                onClick={this.generateAndSendTx}
                                disabled={!isValid || !validAddress}>
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <GenerateTransactionBottomSheet transaction={this.state.generatedTx} show={this.state.showModal}
                                                close={this.closeModal} wallet={this.props.wallet} />
            </React.Fragment>
        );
    };
}

export default SendTransaction;
