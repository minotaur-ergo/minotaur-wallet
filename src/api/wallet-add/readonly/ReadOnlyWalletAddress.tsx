import React, { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import AddressInput from "../../../components/AddressInput";
import { is_valid_address } from "../../../utils/utils";
import * as dbAddressAction from '../../../db/action/address';
import WalletNetworkSelect from "../elements/WalletNetworkSelect";
interface PropsType {
    address: string;
    setAddress: (address: string) => any;
    setNetwork: (network: string) => any;
    goBack: () => any;
    goForward: () => any;
    network: string;
}

const ReadOnlyWalletAddress = (props: PropsType) => {
    const [addresses, setAddresses] = useState<Array<string>>([])
    useEffect(() => {
        dbAddressAction.getAllAddresses().then(addresses => {
            setAddresses(addresses.map(item => item.address))
        })
    }, [])
    const addressError = !is_valid_address(props.address) ? "Invalid address" : addresses.indexOf(props.address) >= 0 ? "Address already exists on a wallet" : "";
    return (
        <Container>
            <Grid container style={{ marginBottom: 10 }} spacing={2}>
                <Grid item xs={12}>
                    <WalletNetworkSelect network={props.network} setNetworkType={(newNetwork) => props.setNetwork(newNetwork)}/>
                </Grid>
                <Grid item xs={12}>
                    <br />
                    <Typography>This is your main address.</Typography>
                    <Typography>
                        Please check it. if this is not your address you entered mnemonic or mnemonic passphrase wrong.
                        double check it and try again
                    </Typography>
                    <AddressInput error={addressError} address={props.address} setAddress={props.setAddress} label="Enter address below" />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goForward} disabled={addressError !== ""}>
                        OK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReadOnlyWalletAddress;
