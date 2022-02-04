import React, { useState } from "react";
import { Button, Container, Grid, makeStyles, Typography } from "@material-ui/core";
import { deriveAddressFromMnemonic } from "../../../action/address";
import CopyableAddress from "../../../components/CopyableAddress";

interface PropsType {
    mnemonic: string,
    password: string,
    goBack: () => any,
    goForward: () => any,
}

const useStyles = makeStyles(theme => ({
    addressRow: {
        padding: "20px 0 20px 0"
    }
}));

const AddressConfirm = (props: PropsType) => {
    const [address, setAddress] = useState();
    const classes = useStyles();
    deriveAddressFromMnemonic(props.mnemonic, props.password, 0).then(derivedAddress => setAddress(derivedAddress.address));
    return (
        <Container>
            <Grid container>
                <Grid item xs={12}>
                    <Typography>This is your main address.</Typography>
                    <Typography>
                        Please check it. if this is not your address you entered mnemonic or mnemonic passphrase wrong.
                        double check it and try again
                    </Typography>
                    <div className={classes.addressRow}>
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
    );
};

export default AddressConfirm;
