import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";
import { deriveNewAddress, deriveReadOnlyAddress } from "../../../action/address";
import Wallet, { WalletType } from "../../../db/entities/Wallet";
import AddressInput from "../../../components/AddressInput";
import { is_valid_address } from "../../../utils/utils";
import * as dbAddressAction from "../../../db/action/address";
import { WalletQrCodeContext } from "../WalletPage";


interface PropsType {
    wallet: Wallet;
    addressDerived: () => any;
}

const DeriveAddress = (props: PropsType) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [addresses, setAddresses] = useState<Array<string>>([]);
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly && !!props.wallet.extended_public_key.trim()) {
            dbAddressAction.getAllAddresses().then(addresses => {
                setAddresses(addresses.map(item => item.address));
            });
        }
    }, [props.wallet.type, props.wallet.extended_public_key]);
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly && !props.wallet.extended_public_key.trim()) {
            debugger
            const addressError = !is_valid_address(address) ? "Invalid address" : addresses.indexOf(address) >= 0 ? "Address already exists on a wallet" : "";
            setAddressError(addressError);
        }
    }, [props.wallet, address, addresses]);
    const deriveAddress = () => {
        if (props.wallet.type === WalletType.ReadOnly && !props.wallet.extended_public_key.trim()) {
            deriveReadOnlyAddress(props.wallet, address, name).then(() => props.addressDerived());
        } else {
            deriveNewAddress(props.wallet, name).then(() => props.addressDerived());
        }
    };
    console.log(addressError, props.wallet)
    return (
        <Container style={{marginTop: "20px"}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        size={"small"}
                        label="New Address Name"
                        error=""
                        value={name}
                        setValue={setName} />
                </Grid>
                {props.wallet.type === WalletType.ReadOnly && !props.wallet.extended_public_key.trim() ? (
                    <Grid item xs={12}>
                        <AddressInput
                            size={"small"}
                            address={address}
                            setAddress={setAddress}
                            contextType={WalletQrCodeContext}
                            error={addressError}
                            label="Enter address below" />
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={addressError !== ""}
                        onClick={() => deriveAddress()}>
                        Derive new address
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DeriveAddress;
