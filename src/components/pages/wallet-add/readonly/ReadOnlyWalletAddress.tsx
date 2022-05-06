import React, { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import { is_valid_address, get_base58_extended_public_key } from "../../../../util/util";
import WalletNetworkSelect from "../elements/WalletNetworkSelect";
import { GlobalStateType } from "../../../../store/reducer";
import { connect } from "react-redux";
import WalletWithErg from "../../../../db/entities/views/WalletWithErg";
import { AddressDbAction } from "../../../../action/db";
import AddressInput from "../../../inputs/AddressInput";
import { CreateWalletQrCodeContext } from "../types";

interface PropsType {
    address: string;
    setAddress: (address: string) => any;
    setNetwork: (network: string) => any;
    goBack: () => any;
    goForward: () => any;
    network: string;
    wallets: Array<WalletWithErg>;
}

const ReadOnlyWalletAddress = (props: PropsType) => {
    const [addresses, setAddresses] = useState<Array<string>>([]);
    useEffect(() => {
        AddressDbAction.getAllAddresses().then(addresses => {
            setAddresses(addresses.map(item => item.address));
        });
    }, []);
    let addressError: string = "";
    const base58 = get_base58_extended_public_key(props.address);
    if(is_valid_address(props.address)){
        if (addresses.indexOf(props.address) >= 0){
            addressError = "Address already exists on a wallet"
        }
    }else if(base58){
        if(props.wallets.filter(item => item.extended_public_key === base58).length > 0){
            addressError = "This extended public key already exists on this device"
        }
    }else{
        addressError = "Invalid address or extended public key";
    }
    return (
        <Container>
            <Grid container style={{ marginBottom: 10 }} spacing={2}>
                <Grid item xs={12}>
                    <WalletNetworkSelect network={props.network}
                                         setNetworkType={(newNetwork) => props.setNetwork(newNetwork)} />
                </Grid>
                <Grid item xs={12}>
                    <br />
                    <Typography>This is your main address.</Typography>
                    <Typography>
                        Please check it. if this is not your address you entered mnemonic or mnemonic passphrase wrong.
                        double check it and try again
                    </Typography>
                    <AddressInput
                        error={addressError}
                        address={props.address}
                        setAddress={props.setAddress}
                        contextType={CreateWalletQrCodeContext}
                        label="Enter address below" />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goForward}
                            disabled={addressError !== ""}>
                        OK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state: GlobalStateType) => ({
    wallets: state.wallet.wallets
});

export default connect(mapStateToProps)(ReadOnlyWalletAddress);
