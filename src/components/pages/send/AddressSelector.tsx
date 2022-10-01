import React from 'react';
import Wallet from '../../../db/entities/Wallet';
import Address from '../../../db/entities/Address';
import AddressWithErg from '../../../db/entities/views/AddressWithErg';
import TokenWithAddress from '../../../db/entities/views/AddressToken';
import { AddressDbAction, BoxContentDbAction } from '../../../action/db';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import Erg from '../../value/Erg';

interface PropsType {
  wallet: Wallet;
  setParams: (
    amount: bigint,
    address: Array<Address> | null,
    tokens: Array<TokenWithAddress>
  ) => any;
}

interface StateType {
  addresses: Array<AddressWithErg>;
  totalTokens: Array<TokenWithAddress>;
  selectedAddress: number;
  multipleSelectedAddresses: Array<number>;
  tokensForWallet: number;
  multiple: boolean;
  published: {
    multiple: boolean;
    selected: number;
    selectedArray: Array<number>;
  };
}

class AddressSelector extends React.Component<PropsType, StateType> {
  state: StateType = {
    addresses: [],
    totalTokens: [],
    multipleSelectedAddresses: [],
    selectedAddress: -1,
    tokensForWallet: -2, // for initial state
    multiple: false,
    published: {
      multiple: false,
      selected: -2,
      selectedArray: [],
    },
  };

  setSelectedAddress = (value: number | Array<number>) => {
    if (this.state.multiple) {
      const arrayValue = value as Array<number>;
      this.setState({
        multipleSelectedAddresses: arrayValue,
        selectedAddress: arrayValue.length === 1 ? arrayValue[0] : -1,
      });
    } else {
      const newSelected =
        value === -1
          ? Array(this.state.addresses.length)
              .fill(0)
              .map((item, index) => index)
          : [value as number];
      this.setState({
        selectedAddress: value as number,
        multipleSelectedAddresses: newSelected,
      });
    }
  };

  getAllAddressErg = () =>
    this.state.addresses
      .map((item: AddressWithErg) => item.erg())
      .reduce((a, b) => a + b, BigInt(0));

  getTotalErg = () => {
    // if(this.state.multiple){
    return this.state.addresses
      .filter(
        (item, index) =>
          this.state.multipleSelectedAddresses.indexOf(index) >= 0
      )
      .map((item) => item.erg())
      .reduce((a, b) => a + b, BigInt(0));
    // }
    // this.state.selectedAddress === -1 ? this.getAllAddressErg() : (this.state.addresses[this.state.selectedAddress]).erg();
  };

  loadExtraContent = async () => {
    if (this.props.wallet.id !== this.state.tokensForWallet) {
      const wallet_id = this.props.wallet.id;
      const addresses = await AddressDbAction.getWalletAddressesWithErg(
        wallet_id
      );
      const tokens = await BoxContentDbAction.getTokenWithAddressForWallet(
        wallet_id
      );
      const multipleSelectedAddresses = this.state.multiple
        ? this.state.multipleSelectedAddresses
        : this.state.selectedAddress === -1
        ? Array(addresses.length)
            .fill(0)
            .map((item, index) => index)
        : [this.state.selectedAddress];
      this.setState({
        addresses: addresses,
        totalTokens: tokens,
        tokensForWallet: wallet_id,
        multipleSelectedAddresses: multipleSelectedAddresses,
      });
    }
  };

  getSelectedAddresses = () => {
    if (this.state.multiple) {
      return this.state.addresses
        .filter(
          (item, index) =>
            this.state.multipleSelectedAddresses.indexOf(index) >= 0
        )
        .map((item) => item.addressObject());
    }
    return [
      (
        this.state.addresses[this.state.selectedAddress] as AddressWithErg
      ).addressObject(),
    ];
  };

  checkNeedPublishState = () => {
    if (this.state.multiple !== this.state.published.multiple) return true;
    if (this.state.multiple) {
      if (
        this.state.multipleSelectedAddresses.length !==
        this.state.published.selectedArray.length
      )
        return true;
      const array1 = this.state.multipleSelectedAddresses.sort();
      const array2 = this.state.published.selectedArray.sort();
      return array1.filter((item, index) => array2[index] !== item).length > 0;
    } else {
      return this.state.selectedAddress !== this.state.published.selected;
    }
  };

  processContent = () => {
    this.loadExtraContent().then(() => null);
    if (this.state.tokensForWallet === this.props.wallet.id) {
      if (this.checkNeedPublishState()) {
        const multiple = this.state.multiple;
        const selected = this.state.selectedAddress;
        const selectedArray = [...this.state.multipleSelectedAddresses];
        if (!multiple && selected === -1) {
          this.props.setParams(
            this.getTotalErg(),
            null,
            this.state.totalTokens
          );
        } else {
          const addresses = this.getSelectedAddresses();
          const addressIds = addresses.map((item) => item.id);
          this.props.setParams(
            this.getTotalErg(),
            this.getSelectedAddresses(),
            this.state.totalTokens.filter(
              (item: TokenWithAddress) =>
                addressIds.indexOf(item.address_id) > -1
            )
          );
        }
        this.setState({
          published: {
            multiple: multiple,
            selected: selected,
            selectedArray: selectedArray,
          },
        });
      }
    }
  };

  componentDidMount() {
    this.processContent();
  }

  componentDidUpdate(
    prevProps: Readonly<PropsType>,
    prevState: Readonly<StateType>,
    snapshot?: any
  ) {
    this.processContent();
  }

  render = () => {
    return (
      <React.Fragment>
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          style={{ marginBottom: -10 }}
        >
          <InputLabel>From Address</InputLabel>
          <Select
            value={
              this.state.multiple
                ? this.state.multipleSelectedAddresses
                : this.state.selectedAddress
            }
            label="From Address"
            multiple={this.state.multiple}
            onChange={(event) =>
              this.setSelectedAddress(event.target.value as number)
            }
          >
            {this.state.multiple ? null : (
              <MenuItem value={-1}>All Addresses</MenuItem>
            )}
            {this.state.addresses.map(
              (address: AddressWithErg, index: number) => (
                <MenuItem key={index} value={index}>
                  {address.name}
                </MenuItem>
              )
            )}
          </Select>
          <FormHelperText>
            Balance:
            <Erg
              erg={this.getTotalErg()}
              showUnit={true}
              network_type={
                this.state.addresses.length
                  ? this.state.addresses[0].network_type
                  : ''
              }
            />
            <FormControlLabel
              style={{ float: 'right' }}
              control={
                <Switch
                  checked={this.state.multiple}
                  onChange={(event) =>
                    this.setState({ multiple: event.target.checked })
                  }
                  name="multiple"
                  color="primary"
                />
              }
              label="Multiple"
            />
          </FormHelperText>
        </FormControl>
      </React.Fragment>
    );
  };
}

export default AddressSelector;
