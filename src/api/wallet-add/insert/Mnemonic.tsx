import React, { useState } from "react";
import { generateMnemonic } from "bip39";
import { Container, Grid, Button } from "@material-ui/core";
import MnemonicView from "../elements/MnemonicView";

interface PropsType {
    mnemonic?: string;
    goBack: () => any;
    goForward: (mnemonic: string) => any;
}

const Mnemonic = (props: PropsType) => {
    const initialMnemonic = props.mnemonic ? props.mnemonic : generateMnemonic(160);
    const [mnemonic] = useState(initialMnemonic);
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2>Create Wallet</h2>
                </Grid>
                <Grid item xs={12}>
                    <p>
                        This is 15-word mnemonic for your ergo wallet.
                        with these 15 word you can restore your wallet on any other device.
                        write words on a paper and store it in a safe and secure place
                    </p>
                </Grid>
                <MnemonicView mnemonic={mnemonic} />
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => props.goForward(mnemonic)}>
                        Yes. I've write it down
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Mnemonic;
