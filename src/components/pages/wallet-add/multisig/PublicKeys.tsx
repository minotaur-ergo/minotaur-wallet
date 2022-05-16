import React, {useState} from 'react'
import {Button, Container, Grid} from "@mui/material";
import AddressInput from "../../../inputs/AddressInput";
import {CreateWalletQrCodeContext} from "../types";
import {is_valid_address} from "../../../../util/util";


interface PublicKeysPropsType {
    public_keys: Array<string>;
    goBack?: () => any;
    goForward: (public_keys: Array<string>) => any;
    children?: React.ReactNode;
}

const TotalSign = (props: PublicKeysPropsType) => {
    const [publicKeys, setPublicKeys] = useState(props.public_keys);
    const setPublicKey = (index: number, publicKey: string) => {
        const newPublicKeys = [...publicKeys]
        newPublicKeys[index] = publicKey
        setPublicKeys(newPublicKeys)
    }
    const formValid = () => {
        return publicKeys ? publicKeys.filter(item => is_valid_address(item)).length > 0 : false;
    }
    return (
        <Container>
            <Grid container columnSpacing={2} marginBottom={2}>
                <Grid item xs={12}>
                    {props.children}
                </Grid>
                {publicKeys.map((publicKey, index) => (
                    <Grid item xs={12} key={index}>
                        <AddressInput
                            address={publicKey}
                            contextType={CreateWalletQrCodeContext}
                            label={"Enter extended public key"}
                            setAddress={(address: string) => setPublicKey(index, address)}/>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => props.goForward(publicKeys)}
                        disabled={!formValid()}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default TotalSign;