import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import PasswordInput from "../../components/PasswordInput";
import TextInput from "../../components/TextInput";
import { PASSWORD_LENGTH } from "../../config/const";

interface PropsType {
    name: string;
    password?: string;
    hidePassword?: boolean;
    dbPassword?: string;
    hideDbPassword?: boolean;
    confirm?: boolean;
    goBack?: () => any;
    goForward: (name: string, password: string, dbPassword: string) => any;
    children: React.ReactElement;
}

const WalletName = (props: PropsType) => {
    const [name, setName] = useState(props.name);
    const [password, setPassword] = useState(props.password ? props.password : "");
    const [passwordConfirm, setPasswordConfirm] = useState(props.password ? props.password : "");
    const [dbPassword, setDbPassword] = useState(props.dbPassword ? props.dbPassword : "");
    const [dbPasswordConfirm, setDbPasswordConfirm] = useState(props.dbPassword ? props.dbPassword : "");

    const validateDbPassword = () => {
        if (props.hideDbPassword) return "";
        if (dbPassword.length < PASSWORD_LENGTH) return `password must be at least ${PASSWORD_LENGTH} characters`;
        return "";
    };

    const validatePasswordConfirm = () => {
        if (props.hidePassword || !props.confirm) return "";
        return (passwordConfirm !== password) ? "Passwords are not same" : "";
    };

    const validateDbPasswordConfirm = () => {
        if (props.hideDbPassword) return "";
        return (dbPasswordConfirm !== dbPassword) ? "Passwords are not same" : "";
    };

    const validateName = () => {
        return (name === "") ? "Name must entered" : "";
    };
    const formValid = () => {
        return validatePasswordConfirm() + validateName() + validateDbPassword() + validateDbPasswordConfirm() === "";
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {props.children}
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <TextInput
                    label="Wallet name"
                    error={validateName()}
                    value={name}
                    setValue={setName} />
                {props.hidePassword ? null : (
                    <React.Fragment>
                        <PasswordInput
                            label="Mnemonic passphrase"
                            error={""}
                            password={password}
                            setPassword={setPassword} />
                        {props.confirm ? (
                            <PasswordInput
                                error={validatePasswordConfirm()}
                                password={passwordConfirm}
                                setPassword={setPasswordConfirm}
                                label="Confirm Mnemonic passphrase" />
                        ) : null}
                    </React.Fragment>
                )}
            </Grid>
            {props.hideDbPassword ? null : (
                <React.Fragment>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <br />
                            Enter a valid password. this password used to encrypt your seed in database.
                            <br />
                            if you forget this password only delete wallet and restore it again with new password.
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordInput
                                label="Encryption password"
                                error={validateDbPassword()}
                                password={dbPassword}
                                setPassword={setDbPassword} />
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordInput
                                error={validateDbPasswordConfirm()}
                                password={dbPasswordConfirm}
                                setPassword={setDbPasswordConfirm}
                                label="Confirm encryption password" />
                        </Grid>
                    </Grid>
                </React.Fragment>
            )}
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => props.goForward(name, password, dbPassword)}
                            disabled={!formValid()}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

};


export default WalletName;
