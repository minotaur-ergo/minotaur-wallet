import React, { useMemo } from 'react';

import { RestoreWalletFlags } from '@minotaur-ergo/types';
import { WarningRounded } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const ImportWalletProblemMessage = (props: RestoreWalletFlags) => {
  const message = useMemo(() => {
    if (props.noSignerWallet) return 'Signer wallet not exists.';
    if (props.duplicate) return `Duplicate with ${props.duplicate.name}`;
    if (props.convert) return `Convert ${props.convert.name} to normal.`;
    return undefined;
  }, [props]);
  const color = useMemo(() => {
    if (props.duplicate || props.noSignerWallet) return `warning.main`;
    if (props.convert) return 'info.main';
    return '';
  }, [props]);
  return (
    <React.Fragment>
      {message ? (
        <Box display="flex" color={color} gap={1}>
          <WarningRounded fontSize="small" />
          <Typography>{message}</Typography>
        </Box>
      ) : undefined}
    </React.Fragment>
  );
};

export default ImportWalletProblemMessage;
