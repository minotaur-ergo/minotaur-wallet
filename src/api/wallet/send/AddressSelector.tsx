import React from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@material-ui/core";
import Erg from "../../../components/Erg";
import Wallet from "../../../db/entities/Wallet";
import { getWalletAddresses } from "../../../db/action/address";
import Address from "../../../db/entities/Address";
import AddressWithErg from "../../../db/entities/views/AddressWithErg";
import TokenWithAddress from "../../../db/entities/views/AddressToken";
import { getTokenWithAddressForWallet } from "../../../db/action/boxContent";

interface PropsType {
    wallet: Wallet;
    setParams: (amount: bigint, address: Address | null, tokens: Array<TokenWithAddress>) => any;
}

interface StateType {
    addresses: Array<AddressWithErg>;
    totalTokens: Array<TokenWithAddress>;
    selectedAddress: number;
    tokensForWallet: number;
    publishedAddress: number;
}

class AddressSelector extends React.Component<PropsType, StateType> {
    state: StateType = {
        addresses: [],
        totalTokens: [],
        selectedAddress: -1,
        tokensForWallet: -2, // for initial state
        publishedAddress: -2
    };
    setSelectedAddress = (value: number) => {
        this.setState({ selectedAddress: value });
    };

    getAllAddressErg = () => this.state.addresses.map((item: AddressWithErg) => item.erg()).reduce((a, b) => a + b, BigInt(0));

    getTotalErg = () => this.state.selectedAddress === -1 ? this.getAllAddressErg() : (this.state.addresses[this.state.selectedAddress] as AddressWithErg).erg();

    loadExtraContent = async () => {
        if (this.props.wallet.id !== this.state.tokensForWallet) {
            const wallet_id = this.props.wallet.id;
            const addresses = await getWalletAddresses(wallet_id);
            const tokens = await getTokenWithAddressForWallet(wallet_id);
            this.setState({
                addresses: addresses,
                totalTokens: tokens,
                tokensForWallet: wallet_id
            });
        }
    };

    processContent = () => {
        this.loadExtraContent().then(() => null);
        if (this.state.tokensForWallet === this.props.wallet.id) {
            if (this.state.publishedAddress !== this.state.selectedAddress) {
                if (this.state.selectedAddress === -1) {
                    this.props.setParams(this.getTotalErg(), null, this.state.totalTokens);
                } else {
                    const addrObject = (this.state.addresses[this.state.selectedAddress] as AddressWithErg).addressObject();
                    this.props.setParams(
                        this.getTotalErg(),
                        addrObject,
                        this.state.totalTokens.filter((item: TokenWithAddress) => item.address_id === addrObject.id)
                    );
                }
                this.setState({ publishedAddress: this.state.selectedAddress });
            }
        }
    };

    componentDidMount() {
        this.processContent();
    }

    componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any) {
        this.processContent();
    }

    render = () => {
        return (
            <React.Fragment>
                <FormControl fullWidth variant="outlined" size="small" style={{ marginBottom: 10 }}>
                    <InputLabel>From Address</InputLabel>
                    <Select
                        value={this.state.selectedAddress}
                        label="From Address"
                        onChange={event => this.setSelectedAddress(event.target.value as number)}
                    >
                        <MenuItem value={-1}>All {this.state.addresses.length} Addresses</MenuItem>
                        {this.state.addresses.map((address: AddressWithErg, index: number) =>
                            <MenuItem key={index} value={index}>{address.name}</MenuItem>
                        )}
                    </Select>
                    <FormHelperText>Balance: <Erg erg={this.getTotalErg()} showUnit={true} network_type={this.state.addresses.length ? this.state.addresses[0].network_type : ""}/></FormHelperText>
                </FormControl>
            </React.Fragment>
        );
    };
}

export default AddressSelector;
