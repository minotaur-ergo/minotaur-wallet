import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import MnemonicView from "../elements/MnemonicView";

interface PropsType {
    mnemonic: string;
    goBack: () => any;
    goForward: () => any;
}

const MnemonicConfirm = (props: PropsType) => {
    const [createdMnemonic, setCreatedMnemonic] = useState("");
    const mnemonicWords = props.mnemonic.split(" ").sort();
    createdMnemonic.split(" ").forEach(item => {
        const index = mnemonicWords.indexOf(item);
        if (index >= 0) {
            mnemonicWords.splice(index, 1);
        }
    });
    const handleMnemonicClick = (index: number) => {
        if (index < mnemonicWords.length && index >= 0) {
            setCreatedMnemonic((createdMnemonic + " " + mnemonicWords[index]).trim());
        }
    };
    const handleCreatedMnemonicClick = (index: number) => {
        setCreatedMnemonic(createdMnemonic.split(" ").filter((item, wordIndex) => index !== wordIndex).join(" "));
    };
    const mnemonic = mnemonicWords.join(" ");
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MnemonicView mnemonic={mnemonic} handleClick={handleMnemonicClick} />
                </Grid>
                <Grid item xs={12}>
                    <p>Use above words to create your written mnemonic</p>
                </Grid>
                <Grid item xs={12}>
                    <MnemonicView mnemonic={createdMnemonic} handleClick={handleCreatedMnemonicClick} />
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
                        disabled={createdMnemonic !== props.mnemonic}
                        onClick={props.goForward}
                    >
                        OK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MnemonicConfirm;
