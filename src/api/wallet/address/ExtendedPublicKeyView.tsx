import React from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import QrCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { show_notification } from "../../../utils/utils";


interface PropsType {
    extended: string;
}

const ExtendedPublicKeyView = (props: PropsType) => {
    return (
        <Container style={{ textAlign: "center" }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>
                    Here you can see your wallet extended public key.
                    using this key in any readonly wallet you can drive your addresses.
                    </Typography>
                    <Typography color="secondary">
                        keep is secret rof your privacy
                    </Typography>
                    <br/>
                </Grid>
                <Grid item xs={12}>
                    {props.extended ? <QrCode value={props.extended} size={256} /> : null}
                </Grid>
                <Grid item xs={12}>
                    <CopyToClipboard
                        text={props.extended}
                        onCopy={() => show_notification("Copied")}>
                        <div style={{ margin: 20, wordWrap: "break-word" }}>{props.extended}</div>
                    </CopyToClipboard>
                </Grid>
                <br />
                <br />
            </Grid>
        </Container>
    );
};

export default ExtendedPublicKeyView;
