import React from 'react';

import {
  ExportWallet,
  ImportProcessingState,
  WalletType,
} from '@minotaur-ergo/types';
import {
  Box,
  Card,
  Chip,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';

import DisplayId from '@/components/display-id/DisplayId';
import WalletIcon from '@/components/export-import/WalletIcon';
import { WalletTypeLabel } from '@/db/entities/Wallet';

interface AbstractWalletItemPropsType {
  selected: boolean;
  wallet: ExportWallet;
  handleSelection: () => unknown;
  status?: ImportProcessingState | undefined;
  disabled?: boolean;
  message?: React.ReactNode;
}

interface WalletItemWithSecretPropsType extends AbstractWalletItemPropsType {
  secret: boolean;
  handleSecret: () => unknown;
}

interface WalletItemWithoutSecretPropsType extends AbstractWalletItemPropsType {
  secret?: undefined;
  handleSecret?: undefined;
}

type WalletItemPropsType =
  | WalletItemWithSecretPropsType
  | WalletItemWithoutSecretPropsType;

const WalletItem = (props: WalletItemPropsType) => {
  return (
    <Box component="label" display="flex" gap={2}>
      <Box sx={{ flexShrink: 0 }}>
        <WalletIcon
          disabled={props.disabled ?? false}
          selected={props.selected}
          status={props.status}
          handleSelection={props.handleSelection}
        />
      </Box>
      <Card sx={{ p: 2, flexGrow: 1 }}>
        <Box display="flex" style={{ opacity: props.disabled ? 0.6 : 1 }}>
          <Typography sx={{ flexGrow: 1 }}>{props.wallet.name}</Typography>
          <Chip size="small" color="default" label={props.wallet.network} />
        </Box>
        {props.wallet.type === WalletType.Normal &&
        props.secret !== undefined ? (
          <FormControlLabel
            checked={props.secret}
            control={<Switch size="small" onChange={props.handleSecret} />}
            label={`as ${WalletTypeLabel[props.secret ? WalletType.Normal : WalletType.ReadOnly]}`}
            slotProps={{
              typography: {
                fontSize: 'small',
                color: props.secret ? 'text.primary' : 'text.secondary',
              },
            }}
          />
        ) : (
          <Typography color="text.secondary" fontSize="small">
            {WalletTypeLabel[props.wallet.type]}
          </Typography>
        )}
        <DisplayId
          color="gray"
          id={
            props.wallet.addresses && props.wallet.addresses.length > 0
              ? props.wallet.addresses[0]
              : 'No address'
          }
        />
        {props.message}
      </Card>
    </Box>
  );
};

export default WalletItem;
