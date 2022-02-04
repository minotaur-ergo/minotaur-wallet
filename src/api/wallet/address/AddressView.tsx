import React, { useEffect, useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import QrCode from "qrcode.react";
import TextInput from "../../../components/TextInput";
import { updateAddressName } from "../../../db/action/address";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AddressWithErg from "../../../db/entities/views/AddressWithErg";
import { show_notification } from "../../../utils/utils";


interface PropsType {
    address: AddressWithErg;
    invalidate: () => any;
}

const AddressView = (props: PropsType) => {
    const [name, setName] = useState({ name: props.address.name, id: -1 });
    const updateName = () => {
        updateAddressName(props.address.id, name.name).then(item => {
            props.invalidate();
        });
    };
    useEffect(() => {
        if (name.id !== props.address.id) {
            setName({ name: props.address.name, id: props.address.id });
        }
    }, [name.id, props.address.id, props.address.name]);
    return (
        <Container style={{ textAlign: "center", marginTop: 20 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        label="Address Name"
                        error={name.name === "" ? "Name is required" : ""}
                        value={name.name}
                        setValue={newName => {
                            setName({ ...name, name: newName });
                        }} />
                </Grid>
                <Grid item xs={12}>
                    {props.address.address ? <QrCode value={props.address.address} size={256} /> : null}
                </Grid>
                <Grid item xs={12}>
                    <CopyToClipboard
                        text={props.address.address}
                        onCopy={() => show_notification("Copied")}>
                        <div style={{ margin: 20, wordWrap: "break-word" }}>{props.address.address}</div>
                    </CopyToClipboard>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ margin: 20, wordWrap: "break-word" }}>Derivation path: {props.address.path}</div>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={name.name === "" || name.id === -1}
                        onClick={() => updateName()}>
                        Update address name
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AddressView;
