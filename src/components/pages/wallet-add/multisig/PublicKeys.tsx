import React, {useState} from 'react'
import {Button, Container, Grid} from "@mui/material";
import AddressInput from "../../../inputs/AddressInput";
import {CreateWalletQrCodeContext} from "../types";
import { get_base58_extended_public_key, is_valid_address } from '../../../../util/util';
import WalletSelectDropDown from './WalletSelectDropDown';


interface PublicKeysPropsType {
    public_keys: Array<string>;
    goBack?: () => any;
    goForward: (wallet: number, public_keys: Array<string>) => any;
    children?: React.ReactNode;
    wallet: number;
}

const TotalSign = (props: PublicKeysPropsType) => {
    const [publicKeys, setPublicKeys] = useState(props.public_keys);
    const [selected, setSelected] = useState(props.wallet)
    const setPublicKey = (index: number, publicKey: string) => {
        const newPublicKeys = [...publicKeys]
        newPublicKeys[index] = publicKey
        setPublicKeys(newPublicKeys)
    }
    const validPublicKey = (publicKey: string) => {
        if(is_valid_address(publicKey) || get_base58_extended_public_key(publicKey)){
            const firstPublicKey = publicKeys[0]
            if(is_valid_address(firstPublicKey) || get_base58_extended_public_key(firstPublicKey)){
                if(is_valid_address(firstPublicKey) !== is_valid_address(publicKey))
                    return "All items must be extended public key or address"
            }
            return ""
        }
        return "Invalid address or extended public key entered"
    }
    const formValid = () => {
        if(selected <= 0) return false
        return publicKeys.length ? publicKeys.filter(item => validPublicKey(item) === "").length > 0 : false;
    }
    return (
        <Container>
            <Grid container columnSpacing={2} spacing={2} marginBottom={2}>
                <Grid item xs={12}>
                    Select a wallet to used as signer from your wallets
                </Grid>
                <Grid item xs={12}>
                    <WalletSelectDropDown selected={selected} select={(value) => setSelected(value)}/>
                </Grid>
                <Grid item xs={12}>
                    Other signers extended public key
                </Grid>
                {publicKeys.map((publicKey, index) => (
                    <Grid item xs={12} key={index}>
                        <AddressInput
                            address={publicKey}
                            error={validPublicKey(publicKey)}
                            contextType={CreateWalletQrCodeContext}
                            label={`Extended public key #${index + 1}`}
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
                        onClick={() => props.goForward(selected, publicKeys)}
                        disabled={!formValid()}>
                        Next
                    </Button>
                </Grid>
            </Grid>
            <br/>
        </Container>
    )
}

export default TotalSign;