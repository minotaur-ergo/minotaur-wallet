import React from 'react';
import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface PublishTypePropsType {
  publishType: PUBLISH_MANUAL_TYPES;
  setPublishType: (newType: PUBLISH_MANUAL_TYPES) => unknown;
}

export enum PUBLISH_MANUAL_TYPES {
  clipboard,
  qrcode,
}

const PublishManualType = (props: PublishTypePropsType) => {
  return (
    <Grid item xs={12} marginTop={2}>
      <ToggleButtonGroup
        color="primary"
        size="medium"
        style={{ width: '100%' }}
        value={props.publishType}
        exclusive
        onChange={(event, newType) => {
          if (newType !== null)
            props.setPublishType(newType as PUBLISH_MANUAL_TYPES);
        }}
      >
        <ToggleButton
          style={{ width: `${50}%` }}
          value={PUBLISH_MANUAL_TYPES.clipboard}
        >
          ClipBoard
        </ToggleButton>
        <ToggleButton
          style={{ width: `${50}%` }}
          value={PUBLISH_MANUAL_TYPES.qrcode}
        >
          QrCode
        </ToggleButton>
      </ToggleButtonGroup>
    </Grid>
  );
};

export default PublishManualType;
