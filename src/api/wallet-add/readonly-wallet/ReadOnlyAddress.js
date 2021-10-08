import React from "react";
import { Button, Container, Grid } from "@material-ui/core";
import TextInput from "../../../components/TextInput";
import { Address } from "ergo-lib-wasm-browser";

class ReadOnlyAddress extends React.Component {
    state = {
        address: '',
    }

    componentDidMount = () => {
        const address = this.props.address ? this.props.address : '';
        this.setState({address: address})
    }

    formValid = () => {
        return this.validateAddress() === '';
    }

    setAddress = address => {
        this.setState({address: address});
    }

    validateAddress = () => {
        try{
            const addr = Address.from_base58(this.state.address)
            return addr
        }catch (exp){
            return "Invalid address. please enter a valid ergo address"
        }
    }

    goBack = () => {
        this.props.setStep(1, {address: ''})
    }

    goConfirm = () => {
        this.props.setStep(3, {address: this.state.address})
    }

    render = () => {
        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {this.props.children}
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <TextInput
                        error={this.validateAddress()}
                        label="Wallet address"
                        value={this.state.address}
                        setValue={this.setAddress}/>
                </Grid>
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item spacing={2}>
                        <Button variant="contained" color="primary" onClick={this.goBack}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item spacing={2}>
                        <Button variant="contained" color="primary" onClick={this.goConfirm}
                                disabled={!this.formValid()}>
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}


export default ReadOnlyAddress;
