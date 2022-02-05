import { Button, Container, Grid } from "@material-ui/core";
import PasswordInput from "./PasswordInput";
import React, { useEffect, useState } from "react";
import Wallet from "../db/entities/Wallet";
import Address from "../db/entities/Address";
import * as addressAction from "../action/address";
import AddressWithErg from "../db/entities/views/AddressWithErg";
import { getNetworkType } from "../config/network_type";


interface PropsType {
    password: string;
    setPassword: (password: string) => any;
    complete: () => any;
    wallet?: Wallet;
    address?: Address | AddressWithErg;
}

const MnemonicPassPhrase = (props: PropsType) => {
    const [passwordValid, setPasswordValid] = useState(false);
    const [validating, setValidating] = useState(false);
    const [lastPassword, setLastPassword] = useState<null | string>(null);
    useEffect(() => {
        if (lastPassword !== props.password && !validating && props.wallet) {
            setValidating(true);
            const password = props.password;
            const wallet = props.wallet;
            const walletAddress = props.address;
            const network_type = getNetworkType(wallet.network_type);
            if (wallet && walletAddress) {
                addressAction.deriveAddress(wallet.extended_public_key, network_type.prefix, walletAddress.idx).then(address => {
                    if (address.address === walletAddress.address) {
                        setPasswordValid(true);
                    } else {
                        setPasswordValid(false);
                    }
                    setLastPassword(password);
                    setValidating(false);
                });
            }
        }
    }, [lastPassword, props.password, props.wallet, props.address, validating]);
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <br />
                    Please enter your mnemonic passphrase
                </Grid>
                <Grid item xs={12}>
                    <PasswordInput
                        label="Mnemonic passphrase"
                        error=""
                        password={props.password}
                        setPassword={props.setPassword} />
                </Grid>
                <Grid item xs={12}>
                    <Button disabled={!passwordValid} variant="contained" fullWidth color="primary"
                            onClick={props.complete}>
                        Sign
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MnemonicPassPhrase;
