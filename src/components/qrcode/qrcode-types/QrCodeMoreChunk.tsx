import React from "react";
import WithAppBar from "../../../layout/WithAppBar";
import AppHeader from "../../app-header/AppHeader";
import { Button, Container, Grid, Typography } from "@mui/material";

interface PropsType {
    chunks: Array<string>
    close: () => any;
    scanNext: () => any;
}

const QrCodeMoreChunk = (props: PropsType) => {
    const completed = props.chunks.filter(item => !!item).length
    return (
        <WithAppBar header={<AppHeader hideQrCode={true} title="More chunks required" back={props.close}/>}>
            <Container style={{marginTop: 20}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography align="center">
                            <img src="../../../assets/qrcode.svg" alt="qrcode"/>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align="center">
                            <h3>more pages are required for this qrcode to compete</h3>
                            <h3>{completed} / {props.chunks.length}</h3>
                            <Button variant="contained" fullWidth color="primary" onClick={props.scanNext}>
                                Scan next qrcode
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </WithAppBar>
    );
};


export default QrCodeMoreChunk;
