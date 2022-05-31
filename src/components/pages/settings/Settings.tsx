import React from 'react';
import WithAppBar from "../../../layout/WithAppBar";
import AppHeader from "../../app-header/AppHeader";
import DisplayModeSelect from "./DisplayModeSelect";
import { Container, Grid } from "@mui/material";


const Settings = () => {
    return (
        <WithAppBar header={<AppHeader hideQrCode={true} title="Wallet Settings"/>}>
            <Container style={{marginTop: 10}}>
                <Grid container spacing={2}>
                    <DisplayModeSelect/>
                    {/*<NightModeSelect/>*/}
                </Grid>
            </Container>
        </WithAppBar>
    )
}

export default Settings