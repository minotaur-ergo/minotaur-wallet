import React from 'react';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DisplayProperty from '@/components/display-property/DisplayProperty';
import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';

interface AssetItemDetailPropsType {
  name?: string;
  id: string;
  description?: string;
  logoSrc?: string;
  balance: React.ReactNode | string;
  emissionAmount: React.ReactNode | string;
  txId: string;
  handleClose: () => unknown;
}

const AssetItemDetail = (props: AssetItemDetailPropsType) => {
  return (
    <React.Fragment>
      <Box display="flex" alignItems="start">
        <Box>
          {props.logoSrc && (
            <Avatar
              alt={props.name}
              src={props.logoSrc}
              sx={{ mt: 2, width: 64, height: 64 }}
            />
          )}
          <Typography variant="h2" sx={{ mt: 2 }}>
            {props.name}
          </Typography>
        </Box>
        <IconButton onClick={props.handleClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography sx={{ mt: 1 }}>{props.description}</Typography>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <DisplayProperty label="Emission amount" value={props.emissionAmount} />
        <DisplayProperty label="Balance" value={props.balance} />
        <DisplayProperty
          label="Token Id"
          value={props.id}
          endAdornment={<CopyToClipboardIcon text={props.id} />}
        />
        {props.txId ? (
          <DisplayProperty
            label="Minting transaction"
            value={props.txId}
            endAdornment={<CopyToClipboardIcon text={props.txId} />}
          />
        ) : null}
      </Stack>
    </React.Fragment>
  );
};

export default AssetItemDetail;
