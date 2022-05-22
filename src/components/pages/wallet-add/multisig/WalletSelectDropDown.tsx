import React from 'react';
import { connect } from 'react-redux';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import WalletWithErg from '../../../../db/entities/views/WalletWithErg';
import { GlobalStateType } from '../../../../store/reducer';

interface WalletSelectPropType {
    wallets: Array<WalletWithErg>;
    selected: number;
    select: (selected: number) => any;
}

const WalletSelect = (props: WalletSelectPropType) => {
    return (
        <React.Fragment>
            <FormControl fullWidth variant='outlined' size='small' style={{ marginBottom: -10 }}>
                <InputLabel>Select Wallet</InputLabel>
                <Select
                    value={props.selected}
                    label='Signing Wallet'
                    multiple={false}
                    onChange={event => props.select(event.target.value as number)}
                >
                    <MenuItem>Select Wallet</MenuItem>
                    {props.wallets.map((wallet: WalletWithErg, index: number) =>
                        <MenuItem key={index} value={wallet.id}>{wallet.name}</MenuItem>,
                    )}
                </Select>
            </FormControl>
        </React.Fragment>
    );
};

const mapsPropsToDispatch = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets,
});

export default connect(mapsPropsToDispatch)(WalletSelect);
