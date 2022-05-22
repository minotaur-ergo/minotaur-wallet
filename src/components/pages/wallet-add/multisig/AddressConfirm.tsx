import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import CopyableAddress from '../../../copyable-address/CopyableAddress';
import { bip32, get_base58_extended_public_key } from '../../../../util/util';
import { AddressAction } from '../../../../action/action';
import { getNetworkType } from '../../../../util/network_type';
import WalletWithErg from '../../../../db/entities/views/WalletWithErg';
import { GlobalStateType } from '../../../../store/reducer';
import { connect } from 'react-redux';


interface AddressConfirmPropsType {
    wallets: Array<WalletWithErg>;
    wallet: number;
    public_keys: Array<string>;
    minSig: number;
    goBack: () => any;
    goForward: () => any;
}

const AddressConfirm = (props: AddressConfirmPropsType) => {
    const [address, setAddress] = useState("")
    useEffect(() => {
        const wallets = props.wallets.filter(item => item.id === props.wallet)
        if(wallets && wallets.length > 0){
            const wallet = wallets[0];
            const pks = [wallet.extended_public_key ,...props.public_keys]
            const publicKeys = pks.map(item => {
                const item_b58 = get_base58_extended_public_key(item)!
                const pub = bip32.fromBase58(item_b58);
                const derived1 = pub.derive(0);
                return derived1.publicKey.toString("hex")
            })
            const address = AddressAction.generateMultiSigAddressFromAddresses(publicKeys, props.minSig, getNetworkType(wallet.network_type))
            setAddress(address)
        }
    })
    return (
        <Container>
            <Grid container>
                <Grid item xs={12} marginBottom={2}>
                    <Typography>This is your main address.</Typography>
                    <Typography>
                        Please check it. if this is not your address you entered mnemonic or mnemonic passphrase wrong.
                        double check it and try again
                    </Typography>
                    <div>
                        <CopyableAddress address={address} />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goForward}>
                        OK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets,
});

export default connect(mapStateToProps)(AddressConfirm);

