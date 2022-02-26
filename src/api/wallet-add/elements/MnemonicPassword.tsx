import React, { useEffect, useState } from "react";
import { Checkbox, Container, FormControlLabel, Grid } from "@material-ui/core";
import PasswordInput from "../../../components/PasswordInput";

interface PropsType {
    password: string;
    valid: boolean;
    confirm?: boolean;
    goBack?: () => any;
    setPassword: (password: string, valid: boolean) => any;
}

const MnemonicPassword = (props: PropsType) => {
    const [usePassword, setUsePassword] = useState(!!props.password);
    const [password, setPassword] = useState(props.password ? props.password : "");
    const [passwordConfirm, setPasswordConfirm] = useState(props.password ? props.password : "");

    const validatePasswordConfirm = () => {
        if (!props.confirm || !usePassword) return "";
        return (passwordConfirm !== password) ? "Passwords are not same" : "";
    };
    useEffect(() => {
        const valid = validatePasswordConfirm() === '';
        const aggregated_password = usePassword ? password : ""
        if(props.password !== aggregated_password || valid !== props.valid){
            props.setPassword(aggregated_password, valid)
        }
    })
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={usePassword}
                            onChange={event => setUsePassword(event.target.checked)}
                            name="use Password"
                            color="primary"
                        />
                    }
                    label="Extend Mnemonic using extra password"
                />
            </Grid>
            {usePassword ? (
                <React.Fragment>
                    <PasswordInput
                        label="Mnemonic passphrase"
                        error={""}
                        password={password}
                        setPassword={setPassword} />
                    {
                        props.confirm ? (
                            <PasswordInput
                                error={validatePasswordConfirm()}
                                password={passwordConfirm}
                                setPassword={setPasswordConfirm}
                                label="Confirm Mnemonic passphrase" />
                        ) : null
                    }
                </React.Fragment>
            ) : null}
        </Grid>
    );

};


export default MnemonicPassword;
