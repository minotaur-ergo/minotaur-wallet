import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import RequestQrcodeDisplay from '../request-qrcode-display/RequestQrcodeDisplay';
import { PUBLISH_MANUAL_TYPES } from './PublishManualType';
import ClipBoardTransfer from './ClipboardTransfer';

interface ShareCommitmentPropsType {
  required: number;
  remainCount: number;
  commitment: string;
  publishTx: () => unknown;
}

const ShareCommitmentMultiSig = (props: ShareCommitmentPropsType) => {
  const [type, setType] = useState(PUBLISH_MANUAL_TYPES.clipboard);
  return (
    <React.Fragment>
      {/*{props.remainCount > 0 ? (*/}
      {/*  <PublishManualType*/}
      {/*    publishType={type}*/}
      {/*    setPublishType={(newType) => setType(newType)}*/}
      {/*  />*/}
      {/*) : null}*/}
      <Grid item xs={12}>
        {props.remainCount === 0 ? (
          <React.Fragment>
            <Typography>Transaction Signed Completely.</Typography>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={() => props.publishTx()}
            >
              Send Transaction
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography>
              {props.required - props.remainCount} of {props.required}{' '}
              signatures added
            </Typography>
            <Typography>
              Your sign added to transaction. Share to other signers
            </Typography>
          </React.Fragment>
        )}
      </Grid>
      {props.remainCount > 0 && type === PUBLISH_MANUAL_TYPES.qrcode ? (
        <RequestQrcodeDisplay
          requestType={'MCR'}
          requestData={props.commitment}
        />
      ) : props.remainCount > 0 ? (
        <ClipBoardTransfer requestData={props.commitment} />
      ) : null}
      <Grid item xs={12} marginBottom={2} />
    </React.Fragment>
  );
};

export default ShareCommitmentMultiSig;
