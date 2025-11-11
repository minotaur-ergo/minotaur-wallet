import React from 'react';

import { ImportProcessingState } from '@minotaur-ergo/types';
import { CheckCircle, HighlightOff } from '@mui/icons-material';
import { Box, Checkbox, CircularProgress } from '@mui/material';

interface WalletIconPropsType {
  status?: ImportProcessingState;
  disabled: boolean;
  selected: boolean;
  handleSelection: () => unknown;
}

const WalletIcon = (props: WalletIconPropsType) => {
  return (
    <React.Fragment>
      {props.status ? (
        <Box p={1}>
          {props.status === ImportProcessingState.Processing && (
            <CircularProgress size={24} />
          )}
          {props.status === ImportProcessingState.Success && (
            <CheckCircle color="success" />
          )}
          {props.status === ImportProcessingState.Error && (
            <HighlightOff color="error" />
          )}
        </Box>
      ) : (
        <Checkbox
          disabled={props.disabled}
          checked={props.selected}
          onChange={props.handleSelection}
        />
      )}
    </React.Fragment>
  );
};

export default WalletIcon;
