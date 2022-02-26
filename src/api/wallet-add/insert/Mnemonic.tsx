import React, { useState } from "react";
import { generateMnemonic } from "bip39";
import { Container, Grid, Button } from "@material-ui/core";
import MnemonicView from "../elements/MnemonicView";
import WalletNetworkSelect from "../elements/WalletNetworkSelect";
import MnemonicPassword from "../elements/MnemonicPassword";

interface PropsType {
    mnemonic?: string;
    mnemonic_passphrase: string;
    goBack: () => any;
    goForward: (mnemonic: string, network: string, mnemonic_passphrase: string) => any;
    network: string;
}

const Mnemonic = (props: PropsType) => {
    const initialMnemonic = props.mnemonic ? props.mnemonic : generateMnemonic(160);
    const [mnemonic] = useState(initialMnemonic);
    const [network, setNetwork] = useState(props.network);
    const [mnemonic_passphrase, set_mnemonic_passphrase] = useState<{ password: string, valid: boolean }>({
        password: props.mnemonic_passphrase,
        valid: true
    });
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <WalletNetworkSelect network={network} setNetworkType={(newNetwork) => setNetwork(newNetwork)} />
                </Grid>
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MnemonicPassword
                        confirm={true}
                        password={mnemonic_passphrase.password}
                        valid={mnemonic_passphrase.valid}
                        setPassword={(password: string, valid: boolean) => set_mnemonic_passphrase({
                            password,
                            valid
                        })} />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!mnemonic_passphrase.valid}
                        onClick={() => props.goForward(mnemonic, network, mnemonic_passphrase.password)}>
                        Yes. I've write it down
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Mnemonic;
