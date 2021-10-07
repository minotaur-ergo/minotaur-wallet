import React from "react";
import { generateMnemonic } from 'bip39';
import {
    Container,
    Grid,
    Button
} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import MnemonicView from "./MnemonicView";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.primary,
        background: "#EFEFEF",
    },
    chip: {
        margin: 5,
    }
})


class Mnemonic extends React.Component {
    state = {
        mnemonic: '',
        passwordValid: false,
    }

    componentDidMount() {
        const mnemonic = this.props.mnemonic ? this.props.mnemonic : generateMnemonic(160);
        this.setState({mnemonic: mnemonic})
    }

    goBack = () => {
        this.props.setStep(1, {mnemonic: ''})
    }

    goConfirm = () => {
        this.props.setStep(3, {mnemonic: this.state.mnemonic})
    }

    render = () => {
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
                    <MnemonicView mnemonic={this.state.mnemonic}/>
                </Grid>
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={this.goBack}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={this.goConfirm}>
                            Yes. I've write it down
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default withStyles(styles, {withTheme: true})(Mnemonic)
