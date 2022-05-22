import React, { useEffect, useState } from 'react';
import Wallet, { WalletType } from '../../../db/entities/Wallet';
import { AddressDbAction } from '../../../action/db';
import { is_valid_address } from '../../../util/util';
import { AddressAction } from '../../../action/action';
import { Button, Container, Grid } from '@mui/material';
import TextInput from '../../inputs/TextInput';
import AddressInput from '../../inputs/AddressInput';
import { WalletQrCodeContext } from '../wallet/types';


interface PropsType {
    wallet: Wallet;
    addressDerived: () => any;
}

const DeriveAddress = (props: PropsType) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [addresses, setAddresses] = useState<Array<string>>([]);
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly && !!props.wallet.extended_public_key.trim()) {
            AddressDbAction.getAllAddresses().then(addresses => {
                setAddresses(addresses.map(item => item.address));
            });
        }
    }, [props.wallet.type, props.wallet.extended_public_key]);
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly && !props.wallet.extended_public_key.trim()) {
            debugger
            const addressError = !is_valid_address(address) ? 'Invalid address' : addresses.indexOf(address) >= 0 ? 'Address already exists on a wallet' : '';
            setAddressError(addressError);
        }
    }, [props.wallet, address, addresses]);
    const deriveAddress = () => {
        if (props.wallet.type === WalletType.MultiSig) {
            AddressAction.deriveNewMultiSigWalletAddress(props.wallet, name).then(() => {
                props.addressDerived();
            });
        } else if (props.wallet.type === WalletType.ReadOnly && !props.wallet.extended_public_key.trim()) {
            AddressAction.deriveReadOnlyAddress(props.wallet, address, name).then(() => props.addressDerived());
        } else {
            AddressAction.deriveNewAddress(props.wallet, name).then(() => props.addressDerived());
        }
    };

    const deleteAddresses = () => {
        AddressDbAction.deleteAddresses(props.wallet.id).then(() => null)
    }
    return (
        <Container style={{ marginTop: '20px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        size={'small'}
                        label='New Address Name'
                        error=''
                        value={name}
                        setValue={setName} />
                </Grid>
                {props.wallet.type === WalletType.ReadOnly && !props.wallet.extended_public_key.trim() ? (
                    <Grid item xs={12}>
                        <AddressInput
                            size={'small'}
                            address={address}
                            setAddress={setAddress}
                            contextType={WalletQrCodeContext}
                            error={addressError}
                            label='Enter address below' />
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        disabled={addressError !== ''}
                        onClick={() => deriveAddress()}>
                        Derive new address
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={() => deleteAddresses()}>
                        Delete Available Addresses
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DeriveAddress;
