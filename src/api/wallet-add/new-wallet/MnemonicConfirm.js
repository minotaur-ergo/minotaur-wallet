import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import MnemonicView from "./MnemonicView";

const MnemonicConfirm = props => {
    const [createdMnemonic, setCreatedMnemonic] = useState("")
    const goBack = () => {props.setStep(2, {})}
    const mnemonicWords = props.mnemonic.split(" ").filter(item => createdMnemonic.split(" ").indexOf(item) === -1).sort()
    const handleMnemonicClick = index => {
        if(index < mnemonicWords.length && index >= 0) {
            setCreatedMnemonic((createdMnemonic + " " + mnemonicWords[index]).trim())
        }
    }
    const handleCreatedMnemonicClick = index => {
        setCreatedMnemonic(createdMnemonic.split(" ").filter((item, wordIndex) => index !== wordIndex).join(" "))
    }
    const mnemonic = mnemonicWords.join(" ");
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MnemonicView mnemonic={mnemonic} handleClick={handleMnemonicClick}/>
                </Grid>
                <Grid item xs={12}>
                    <p>Use above words to create your written mnemonic</p>
                </Grid>
                <Grid item xs={12}>
                    <MnemonicView mnemonic={createdMnemonic} handleClick={handleCreatedMnemonicClick}/>
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item spacing={2}>
                    <Button variant="contained" color="primary" onClick={goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item spacing={2}>
                    <Button variant="contained" color="primary" disabled={createdMnemonic !== props.mnemonic}>
                        OK
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default MnemonicConfirm;
