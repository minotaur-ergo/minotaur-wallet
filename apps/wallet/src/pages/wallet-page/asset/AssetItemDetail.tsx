import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalStateType } from '@minotaur-ergo/types';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';

import TokenAmountDisplay from '@/components/amounts-display/TokenAmountDisplay';
import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import DisplayProperty from '@/components/display-property/DisplayProperty';
import useAssetDetail from '@/hooks/useAssetDetail';

import AssetItemDescription from './AssetItemDescription';

interface AssetItemDetailPropsType {
  id: string;
  balance?: bigint;
  handleClose: () => unknown;
  network_type: string;
}

const AssetItemDetail = (props: AssetItemDetailPropsType) => {
  const hideAssetsValues = useSelector(
    (state: GlobalStateType) => state.config.hideAssetsValues,
  );
  const details = useAssetDetail(props.id, props.network_type);
  return (
    <React.Fragment>
      <Box display="flex" alignItems="start">
        <Box>
          {details.logo ? (
            <Avatar sx={{ mt: 2, width: 64, height: 64 }} alt={details.name}>
              {details.logo}
            </Avatar>
          ) : undefined}
          <Typography variant="h2" sx={{ mt: 2 }}>
            {details.name}
          </Typography>
        </Box>
        <IconButton onClick={props.handleClose} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {details.description && (
        <AssetItemDescription description={details.description} />
      )}

      <Stack spacing={2} sx={{ mt: 3 }}>
        <DisplayProperty
          label="Emission amount"
          value={
            <TokenAmountDisplay
              amount={details.emissionAmount}
              decimal={details.decimal}
              hide={hideAssetsValues}
            />
          }
        />
        {props.balance ? (
          <DisplayProperty
            label="Balance"
            value={
              <TokenAmountDisplay
                amount={props.balance}
                decimal={details.decimal}
                hide={hideAssetsValues}
              />
            }
          />
        ) : null}
        <DisplayProperty
          label="Token Id"
          value={props.id}
          endAdornment={<CopyToClipboardIcon text={props.id} />}
        />
        {details.txId ? (
          <DisplayProperty
            label="Minting transaction"
            value={details.txId}
            endAdornment={<CopyToClipboardIcon text={details.txId} />}
          />
        ) : null}
      </Stack>
    </React.Fragment>
  );
};

export default AssetItemDetail;
