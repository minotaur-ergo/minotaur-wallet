import React from "react";
import { Divider, List, ListItem, ListItemText } from "@material-ui/core";
import AddressElement from "./AddressElement";
import DeriveAddress from "./DeriveAddress";
import { getWalletAddresses } from "../../../action/address";
import BottomSheet from "../../../components/bottom-sheet/BottomSheet";
import AddressView from "./AddressView";
import AddressWithErg from "../../../db/entities/views/AddressWithErg";
import { WalletPagePropsType } from "../../../utils/interface";
import ExtendedPublicKeyView from "./ExtendedPublicKeyView";

interface StateType {
    addresses: Array<AddressWithErg>;
    selectedAddr: AddressWithErg | null;
    showAddress: boolean;
    addressValid: boolean;
    showExtended: boolean;
}

class AddressList extends React.Component<WalletPagePropsType, StateType> {
    state: StateType = {
        addresses: [],
        selectedAddr: null,
        showAddress: false,
        addressValid: false,
        showExtended: false
    };
    load_data = () => {
        if (!this.state.addressValid) {
            getWalletAddresses(this.props.wallet.id).then(dbAddresses => {
                this.setState({
                    addresses: dbAddresses,
                    addressValid: true
                });
            });
        }
    };
    componentDidMount = () => {
        this.props.setTab("address");
        this.load_data();
    };

    componentDidUpdate = () => {
        this.load_data();
    };

    addressDerived = () => {
        this.setState({ addressValid: false });
    };

    showAddress = (address: AddressWithErg) => {
        this.setState({
            selectedAddr: address,
            showAddress: true
        });
    };

    showPublicKey = () => {
        this.setState({
            showExtended: true
        });
    };

    closeAddress = () => {
        this.setState({
            showAddress: false
        });
    };

    closeExtended = () => {
        this.setState({
            showExtended: false
        });
    };

    render = () => {
        const selectedAddress: AddressWithErg | null = this.state.selectedAddr;
        return (
            <React.Fragment>
                {this.state.addressValid && this.props.wallet && this.props.wallet.type ? (
                    <DeriveAddress
                        wallet={this.props.wallet}
                        addressDerived={this.addressDerived} />
                ) : null}
                <List>
                    {!!this.props.wallet.extended_public_key.trim() ? (
                        <React.Fragment>
                            <Divider />
                            <ListItem onClick={this.showPublicKey}>
                                <ListItemText primary={"Display Extended public key"} />
                            </ListItem>
                        </React.Fragment>
                    ) : null}
                    {this.state.addresses.map((address: AddressWithErg) => (
                        <React.Fragment key={address.id}>
                            <Divider />
                            <AddressElement
                                network_type={address.network_type}
                                handleClick={() => this.showAddress(address)}
                                address={address.address}
                                id={address.id}
                                name={address.name}
                                erg={address.erg()}
                                token_count={address.token_count} />
                        </React.Fragment>
                    ))}
                </List>
                <BottomSheet
                    show={this.state.selectedAddr !== null && this.state.showAddress}
                    close={() => this.closeAddress()}>
                    {selectedAddress !== null ? (
                        <AddressView address={selectedAddress}
                                     invalidate={() => this.setState({ addressValid: false })} />
                    ) : null}
                </BottomSheet>
                {this.props.wallet.extended_public_key.trim() ? (
                    <BottomSheet
                        show={this.state.showExtended}
                        close={() => this.closeExtended()}>
                        <ExtendedPublicKeyView extended={this.props.wallet.extended_public_key} />
                    </BottomSheet>
                ) : null}
            </React.Fragment>
        );
    }
    ;
}

export default AddressList;
