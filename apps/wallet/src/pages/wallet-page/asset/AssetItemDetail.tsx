import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';

import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import DisplayProperty from '@/components/display-property/DisplayProperty';

import AssetItemDescription from './AssetItemDescription';

interface AssetItemDetailPropsType {
  name?: string;
  id: string;
  description?: string;
  logo?: React.ReactNode;
  balance?: React.ReactNode | string;
  emissionAmount: React.ReactNode | string;
  txId: string;
  handleClose: () => unknown;
}

const AssetItemDetail = (props: AssetItemDetailPropsType) => {
  return (
    <React.Fragment>
      <Box display="flex" alignItems="start">
        <Box>
          {props.logo ? (
            <Avatar sx={{ mt: 2, width: 64, height: 64 }} alt={props.name}>
              {props.logo}
            </Avatar>
          ) : undefined}
          <Typography variant="h2" sx={{ mt: 2 }}>
            {props.name}
          </Typography>
        </Box>
        <IconButton onClick={props.handleClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <AssetItemDescription description={props.description} />

      <Stack spacing={2} sx={{ mt: 3 }}>
        <DisplayProperty label="Emission amount" value={props.emissionAmount} />
        {props.balance ? (
          <DisplayProperty label="Balance" value={props.balance} />
        ) : null}
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
