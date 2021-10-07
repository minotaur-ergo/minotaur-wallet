import React from "react";
import { Button, Container, Grid } from "@material-ui/core";
import MnemonicView from "./new-wallet/MnemonicView";
import PasswordInput from "../../components/PasswordInput";
import { PASSWORD_LENGTH } from "../../const";
import TextInput from "../../components/TextInput";

class Name extends React.Component {
    state = {
        name: '',
        password: '',
        passwordConfirm: '',
    }

    componentDidMount = () => {
        const name = this.props.name ? this.props.name : '';
        const password = this.props.password ? this.props.password : '';
        this.setState({name: name, password: password, passwordConfirm: password})
    }

    formValid = () => {
        return this.validatePassword() === '' && this.validatePasswordConfirm() === '' && this.validateName() === '';
    }

    setPassword = (password) => {
        this.setState({password: password})
    }

    setPasswordConfirm = password => {
        this.setState({passwordConfirm: password});
    }

    setName = name => {
        this.setState({name: name});
    }

    validatePassword = () => {
        if(this.props.hidePassword) return ''
        return (this.state.password.length < PASSWORD_LENGTH) ? 'Password length must be atleast ' + PASSWORD_LENGTH + ' characters' : "";
    }

    validatePasswordConfirm = () => {
        if(this.props.hidePassword || !this.props.confirm) return ''
        return (this.state.passwordConfirm !== this.state.password) ? 'Passwords are not same' : "";
    }

    validateName = () => {
        return (this.state.name === '') ? "Name must entered" : ''
    }

    goBack = () => {
        this.props.setStep(0, {name: '', password: ''})
    }

    goMnemonic = () => {
        this.props.setStep(2, {name: this.state.name, password: this.state.password})
    }

    render = () => {
        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {this.props.children}
                    </Grid>
                    <MnemonicView mnemonic={this.state.mnemonic}/>
                </Grid>
                <Grid container spacing={2}>
                    <TextInput
                        label="Wallet name"
                        error={this.validateName()}
                        value={this.state.name}
                        setValue={this.setName}/>
                    {this.props.hidePassword ? null : (
                        <React.Fragment>
                            <PasswordInput
                                label="Password"
                                error={this.validatePassword()}
                                password={this.props.password}
                                setPassword={this.setPassword}/>
                            {this.props.confirm ? (
                                <PasswordInput
                                    error={this.validatePasswordConfirm()}
                                    password={this.props.passwordConfirm}
                                    setPassword={this.setPasswordConfirm}
                                    label="Confirm Password"
                                    validate={this.validatePasswordConfirm}/>
                            ) : null}
                        </React.Fragment>
                    )}
                </Grid>
                <Grid container spacing={2} justifyContent="space-between">
                    <Grid item spacing={2}>
                        <Button variant="contained" color="primary" onClick={this.goBack}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item spacing={2}>
                        <Button variant="contained" color="primary" onClick={this.goMnemonic}
                                disabled={!this.formValid()}>
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}


export default Name;
