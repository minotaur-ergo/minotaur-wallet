import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import clipboard from 'clipboardy';

interface MultiSigDataReaderPropsType {
    newData: (data: string) => any;
}

const MultiSigDataReader = (props: MultiSigDataReaderPropsType) => {
    const readClipBoard = () => {
        clipboard.read().then(res => {
            props.newData(res);
        });
    };
    return (
        <Grid container aria-orientation="horizontal" spacing={2}>
            <Grid item xs={12} marginTop={2}>
                <Typography>Read data from other wallets:</Typography>
            </Grid>
            <Grid item xs={6}>
                <Button variant='contained' fullWidth color='primary' onClick={readClipBoard}>
                    Clipboard
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button variant='contained' fullWidth color='primary' onClick={readClipBoard}>
                    QRCODE
                </Button>
            </Grid>
        </Grid>
    );
};

export default MultiSigDataReader;