import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import PasswordInput from '../inputs/PasswordInput';
import { AddressAction } from '../../action/action';
import Wallet from '../../db/entities/Wallet';


interface RenderPasswordPropsType {
    accept: (password: string) => any;
    wallet: Wallet;
}

const RenderPassword = (props: RenderPasswordPropsType) => {
    const [password, setPassword] = useState('');
    const passwordValid = () => {
        return AddressAction.validatePassword(props.wallet, password);
    };
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <br />
                Please enter your mnemonic passphrase to send transaction
            </Grid>
            <Grid item xs={12}>
                <PasswordInput
                    size={'small'}
                    label='Wallet password'
                    error=''
                    password={password}
                    setPassword={password => setPassword(password)} />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant='contained'
                    fullWidth
                    color='primary'
                    onClick={() => props.accept(password)}
                    disabled={!passwordValid()}
                >
                    Create Commitment
                </Button>
            </Grid>
        </React.Fragment>
    );
};

export default RenderPassword;