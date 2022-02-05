import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import PasswordInput from "../../components/PasswordInput";
import TextInput from "../../components/TextInput";

interface PropsType {
    name: string;
    password?: string;
    hidePassword?: boolean;
    hideDbPassword?: boolean;
    confirm?: boolean;
    goBack?: () => any;
    goForward: (name: string, password: string) => any;
    children: React.ReactElement;
}

const WalletName = (props: PropsType) => {
    const [name, setName] = useState(props.name);
    const [password, setPassword] = useState(props.password ? props.password : "");
    const [passwordConfirm, setPasswordConfirm] = useState(props.password ? props.password : "");

    const validatePasswordConfirm = () => {
        if (props.hidePassword || !props.confirm) return "";
        return (passwordConfirm !== password) ? "Passwords are not same" : "";
    };

    const validateName = () => {
        return (name === "") ? "Name must entered" : "";
    };
    const formValid = () => {
        return validatePasswordConfirm() + validateName() === "";
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
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => props.goForward(name, password)}
                            disabled={!formValid()}>
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

};


export default WalletName;
