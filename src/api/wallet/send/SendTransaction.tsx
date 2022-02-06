import React from "react";
import { Button, Container, Divider, Grid } from "@material-ui/core";
import { WalletPagePropsType } from "../WalletPage";
import ReceiverRow from "./ReceiverRow";
import AddressSelector from "./AddressSelector";
import Address from "../../../db/entities/Address";
import { createTx, Receiver, UnsignedGeneratedTx } from "../../../action/blockchain";
import { FEE } from "../../../config/const";
import TokenWithAddress from "../../../db/entities/views/AddressToken";
import GenerateTransactionBottomSheet from "../../../components/GenerateTransactionBottomSheet";
import { show_notification } from "../../../utils/utils";

interface StateType {
    receivers: Array<Receiver>;
    totalErg: bigint;
    showModal: boolean;
    selectedAddress: Address | null | undefined;
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
    state = {
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

    setParams = (amount: bigint, address: Address | null, tokens: Array<TokenWithAddress>) => {
        if (getAddressId(address) !== getAddressId(this.state.selectedAddress)) {
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
            debugger
            const tx = await createTx(this.state.receivers, this.props.wallet, this.state.selectedAddress)
            this.setState({
                showModal: true,
                generatedTx: tx
            });
        }catch (e){
            show_notification(e);
        }
    }

    componentDidMount() {
        this.props.setTab("send");
    }

    render = () => {
        const isValid = this.state.receivers.filter((item: Receiver) => !item.valid()).length === 0;
        return (
            <React.Fragment>
                <Container style={{ marginTop: 20 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <AddressSelector setParams={this.setParams} wallet={this.props.wallet} />
                            <Divider />
                            {this.state.receivers.map((receiver: Receiver, index: number) => (
                                <ReceiverRow
                                    tokens={this.state.availableTokens}
                                    key={`sender-${index}`}
                                    remaining={this.state.totalErg - FEE}
                                    value={receiver}
                                    network_type={this.props.wallet.network_type}
                                    setValue={param => this.updateReceivers(index, param)} />
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                fullWidth
                                color="primary"
                                onClick={this.generateAndSendTx}
                                disabled={!isValid}>
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
                <GenerateTransactionBottomSheet transaction={this.state.generatedTx} show={this.state.showModal} close={this.closeModal} wallet={this.props.wallet}/>
            </React.Fragment>
        );
    };
}

export default SendTransaction;
