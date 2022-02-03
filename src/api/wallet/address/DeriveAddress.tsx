import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";
import { deriveNewAddress, deriveReadOnlyAddress, validatePassword } from "../../../action/address";
import Wallet, { WalletType } from "../../../db/entities/Wallet";
import AddressInput from "../../../components/AddressInput";
import { is_valid_address } from "../../../utils/utils";
import * as dbAddressAction from "../../../db/action/address";

interface PropsType {
    wallet: Wallet;
    address?: string;
    index: number;
    addressDerived: () => any;
}

const DeriveAddress = (props: PropsType) => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [addresses, setAddresses] = useState<Array<string>>([])
    useEffect(() => {
        if(props.wallet.type === WalletType.ReadOnly) {
            dbAddressAction.getAllAddresses().then(addresses => {
                setAddresses(addresses.map(item => item.address))
            })
        }
    }, [props.wallet.type])
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly) {
            const addressError = !is_valid_address(address) ? "Invalid address" : addresses.indexOf(address) >= 0 ? "Address already exists on a wallet" : "";
            setPasswordError(addressError);
        } else {
            if(props.address) {
                validatePassword(props.wallet, password, props.address, props.index).then((isValid: boolean) => setPasswordError(isValid ? "" : "Password is incorrect"));
            }else{
                setPasswordError("")
            }
        }
    }, [password, props.wallet, props.address, props.index, address, addresses]);
    const deriveAddress = () => {
        if (props.wallet.type === WalletType.ReadOnly || !props.address) {
            deriveReadOnlyAddress(props.wallet, address, name).then(() => props.addressDerived());
        } else {
            deriveNewAddress(props.wallet, password, name).then(() => props.addressDerived());
        }
    };
    return (
        <Container style={{ marginTop: 20, marginBottom: 20 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        label="New Address Name"
                        error={name === "" ? "Name is required" : ""}
                        value={name}
                        setValue={setName} />
                </Grid>
                <Grid item xs={12}>
                    {props.wallet.type === WalletType.ReadOnly ? (
                        <AddressInput
                            address={address}
                            setAddress={setAddress}
                            error={passwordError}
                            label="Enter address below" />
                    ) : (
                        <TextInput
                            label="Wallet password"
                            type="password"
                            error={passwordError}
                            value={password}
                            setValue={setPassword} />
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={passwordError !== "" || name === ""}
                        onClick={() => deriveAddress()}>
                        Derive new address
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DeriveAddress;
