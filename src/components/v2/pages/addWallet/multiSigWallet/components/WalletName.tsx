import React, { Dispatch, SetStateAction } from 'react';
import { Box, TextField, Alert, Typography } from '@mui/material';
import { WalletDataType } from '../MultiSigWallet';

interface PropsType {
  data: WalletDataType;
  setData: Dispatch<SetStateAction<WalletDataType>>;
}

export default function WalletName({ data, setData }: PropsType) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ p: 1 }}>
        Choose a name for your multi-signature wallet
      </Typography>
      <TextField
        label="Wallet name"
        value={data.name}
        onChange={(e) =>
          setData((prevState: WalletDataType) => ({
            ...prevState,
            name: e.target.value,
          }))
        }
      />

      <Alert severity="warning" icon={false} sx={{ mt: 2 }}>
        This is a read-only wallet and cannot be used to sign any transaction.
        You need the corresponding cold wallet in order to sign transactions and
        send funds from this wallet.
      </Alert>
    </Box>
  );
}
