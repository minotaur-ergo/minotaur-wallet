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
    const createdIndex: Array<number> = []
    createdMnemonic.split(" ").forEach(item => {
        let index = mnemonicWords.indexOf(item);
        while (createdIndex.indexOf(index) >= 0 && index >= 0){
            index = mnemonicWords.indexOf(item, index)
        }
        if (index >= 0) {
            createdIndex.push(index)
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
                    <MnemonicView hideIndex={createdIndex} mnemonic={mnemonic} handleClick={handleMnemonicClick} />
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
