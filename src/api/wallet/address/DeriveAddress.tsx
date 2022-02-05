import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";
import { deriveNewAddress, deriveReadOnlyAddress } from "../../../action/address";
import Wallet, { WalletType } from "../../../db/entities/Wallet";
import AddressInput from "../../../components/AddressInput";
import { is_valid_address } from "../../../utils/utils";
import * as dbAddressAction from "../../../db/action/address";


interface PropsType {
    wallet: Wallet;
    index: number;
    addressDerived: () => any;
}

const DeriveAddress = (props: PropsType) => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [addresses, setAddresses] = useState<Array<string>>([]);
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly) {
            dbAddressAction.getAllAddresses().then(addresses => {
                setAddresses(addresses.map(item => item.address));
            });
        }
    }, [props.wallet.type]);
    useEffect(() => {
        if (props.wallet.type === WalletType.ReadOnly) {
            const addressError = !is_valid_address(address) ? "Invalid address" : addresses.indexOf(address) >= 0 ? "Address already exists on a wallet" : "";
            setAddressError(addressError);
        }
    }, [props.wallet, props.index, address, addresses]);
    const deriveAddress = () => {
        if (props.wallet.type === WalletType.ReadOnly) {
            deriveReadOnlyAddress(props.wallet, address, name).then(() => props.addressDerived());
        } else {
            deriveNewAddress(props.wallet, name).then(() => props.addressDerived());
        }
    };
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        size={"small"}
                        label="New Address Name"
                        error={name === "" ? "Name is required" : ""}
                        value={name}
                        setValue={setName} />
                </Grid>
                {props.wallet.type === WalletType.ReadOnly ? (
                    <Grid item xs={12}>
                        <AddressInput
                            address={address}
                            setAddress={setAddress}
                            error={addressError}
                            label="Enter address below" />
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={addressError !== "" || name === ""}
                        onClick={() => deriveAddress()}>
                        Derive new address
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DeriveAddress;
