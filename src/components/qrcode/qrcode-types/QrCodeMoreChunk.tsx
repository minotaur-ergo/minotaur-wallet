import React from 'react';
import WithAppBar from '../../../layout/WithAppBar';
import AppHeader from '../../app-header/AppHeader';
import { Button, Container, Grid, Typography } from '@mui/material';
import qrcode from '../../../assets/qrcode.svg';
interface PropsType {
  chunks: Array<string>;
  close: () => unknown;
  scanNext: () => unknown;
}

const QrCodeMoreChunk = (props: PropsType) => {
  const completed = props.chunks.filter((item) => !!item).length;
  console.log(`chunks are: ${JSON.stringify(props.chunks)}`);
  return (
    <WithAppBar
      header={
        <AppHeader
          hideQrCode={true}
          title="More chunks required"
          back={props.close}
        />
      }
    >
      <Container style={{ marginTop: 20 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center">
              <img src={qrcode} alt="qrcode" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ textAlign: 'center' }}>
              <h3>more pages are required for this qrcode to compete</h3>
              <h3>
                {completed} / {props.chunks.length}
              </h3>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={props.scanNext}
              >
                Scan next qrcode
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </WithAppBar>
  );
};

export default QrCodeMoreChunk;
