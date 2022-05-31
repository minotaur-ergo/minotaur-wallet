import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import PasswordInput from '../inputs/PasswordInput';
import { AddressAction } from '../../action/action';
import Wallet from '../../db/entities/Wallet';


interface RenderPasswordPropsType {
    accept: (password: string, cosigning: boolean) => any;
    wallet: Wallet;
    selectCosigning: boolean;
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
                {props.selectCosigning ? (
                <Grid container spacing={2} aria-orientation={'horizontal'}>
                    <Grid item xs={12}>
                        <Typography>
                            Select message passing approach between wallets
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            fullWidth
                            color='primary'
                            onClick={() => props.accept(password, false)}
                            disabled={!passwordValid()}
                        >
                            Manual Sign
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant='contained'
                            fullWidth
                            color='primary'
                            onClick={() => props.accept(password, true)}
                            disabled={!passwordValid()}
                        >
                            Cosigning Server
                        </Button>
                    </Grid>
                </Grid>
                ) : (
                    <Button
                        variant='contained'
                        fullWidth
                        color='primary'
                        onClick={() => props.accept(password, false)}
                        disabled={!passwordValid()}
                    >
                        Continue Signing
                    </Button>
                )}
            </Grid>
        </React.Fragment>
    );
};

export default RenderPassword;