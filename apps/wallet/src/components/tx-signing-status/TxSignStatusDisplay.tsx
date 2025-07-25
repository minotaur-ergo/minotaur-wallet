import React from 'react';

import { Box, CircularProgress } from '@mui/material';

import { StatusEnum } from '../sign/context/TxSignContext';
import StateMessage from '../state-message/StateMessage';

interface TxSignStatusDisplayPropsType {
  status: StatusEnum;
  children?: React.ReactNode;
}
const TxSignStatusDisplay = (props: TxSignStatusDisplayPropsType) => {
  const isStatusValid =
    props.status === StatusEnum.SIGNING || props.status === StatusEnum.SENDING;
  return (
    <React.Fragment>
      {isStatusValid ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <StateMessage
            title={
              props.status === StatusEnum.SIGNING
                ? 'Signing Transaction'
                : 'Sending Transaction to Blockchain'
            }
            description="Please wait"
            icon={<CircularProgress />}
          />
        </Box>
      ) : undefined}
      <div style={isStatusValid ? { display: 'none' } : {}}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default TxSignStatusDisplay;
