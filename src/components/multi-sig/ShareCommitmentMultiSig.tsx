import React, { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import RequestQrcodeDisplay from '../request-qrcode-display/RequestQrcodeDisplay';
import { PUBLISH_MANUAL_TYPES } from './PublishManualType';
import ClipBoardTransfer from './ClipboardTransfer';

interface ShareCommitmentPropsType {
  required: number;
  count: number;
  commitment: string;
}

const ShareCommitmentMultiSig = (props: ShareCommitmentPropsType) => {
  const [type, setType] = useState(PUBLISH_MANUAL_TYPES.clipboard);
  return (
    <React.Fragment>
      {/*<PublishManualType*/}
      {/*  publishType={type}*/}
      {/*  setPublishType={(newType) => setType(newType)}*/}
      {/*/>*/}
      <Grid item xs={12}>
        Please share this data to wallet signers.
        <br />
        {props.count >= props.required ? (
          <React.Fragment>
            <Typography>sign process in progress</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography>
              {props.count} of {props.required} required commitment collected
            </Typography>
          </React.Fragment>
        )}
      </Grid>
      {type === PUBLISH_MANUAL_TYPES.qrcode ? (
        <RequestQrcodeDisplay
          requestType={'MCR'}
          requestData={props.commitment}
        />
      ) : (
        <ClipBoardTransfer requestData={props.commitment} />
      )}
      <Grid item xs={12} marginBottom={2}></Grid>
    </React.Fragment>
  );
};

export default ShareCommitmentMultiSig;
