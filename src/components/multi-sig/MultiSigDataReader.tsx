import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { Clipboard } from '@capacitor/clipboard';
import clipboard from 'clipboardy';
import { Capacitor } from '@capacitor/core';

interface MultiSigDataReaderPropsType {
  newData: (data: string) => unknown;
}

const MultiSigDataReader = (props: MultiSigDataReaderPropsType) => {
  const readClipBoard = () => {
    if (
      Capacitor.getPlatform() === 'android' ||
      Capacitor.getPlatform() === 'ios'
    ) {
      Clipboard.read().then((res) => props.newData(res.value));
    } else {
      clipboard.read().then((res) => props.newData(res));
    }
  };
  return (
    <Grid container aria-orientation="horizontal" spacing={2}>
      <Grid item xs={12} marginTop={2}>
        <Typography>Read data from other wallets:</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={readClipBoard}
        >
          Clipboard
        </Button>
      </Grid>
      {/*<Grid item xs={6}>*/}
      {/*  <Button*/}
      {/*    variant="contained"*/}
      {/*    fullWidth*/}
      {/*    color="primary"*/}
      {/*    onClick={readClipBoard}*/}
      {/*  >*/}
      {/*    QRCODE*/}
      {/*  </Button>*/}
      {/*</Grid>*/}
    </Grid>
  );
};

export default MultiSigDataReader;
