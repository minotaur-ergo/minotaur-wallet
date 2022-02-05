import React, { useState } from "react";
import { Button, Container, Grid } from "@material-ui/core";
import PasswordInput from "../../components/PasswordInput";
import { PASSWORD_LENGTH } from "../../config/const";


interface PropsType {
    password?: string;
    goBack?: () => any;
    goForward: (password: string) => any;
}

const WalletPassword = (props: PropsType) => {
    const [password, setPassword] = useState(props.password ? props.password : "");
    const [confirmPassword, setConfirmPassword] = useState(props.password ? props.password : "");
    const passwordError = () => {
        if (password === "") return "Password is required";
        if (password.length < PASSWORD_LENGTH) return `Password length must be at least ${PASSWORD_LENGTH} characters`;
        return "";
    };
    const passwordConfirmError = () => {
        return password !== confirmPassword ? "Password are not same" : "";
    };
    const formValid = () => {
        return passwordError() + passwordConfirmError() === "";
    }
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <br />
                    Enter a valid password. this password used to encrypt your seed in database.
                    <br />
                    if you forget this password only delete wallet and restore it again with new password.
                </Grid>
                <Grid item xs={12}>
                    <PasswordInput
                        label="Wallet password"
                        error={passwordError()}
                        password={password}
                        setPassword={setPassword} />
                </Grid>
                <Grid item xs={12}>
                    <PasswordInput
                        error={passwordConfirmError()}
                        password={confirmPassword}
                        setPassword={setConfirmPassword}
                        label="Confirm Wallet password" />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                    <Button variant="contained" color="primary" onClick={props.goBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={() => props.goForward(password)}
                            disabled={!formValid()}>
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default WalletPassword;
