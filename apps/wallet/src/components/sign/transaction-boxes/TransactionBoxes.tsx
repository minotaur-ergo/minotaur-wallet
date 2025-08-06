import { useContext } from 'react';

import * as wasm from '@minotaur-ergo/ergo-lib';
import { StateWallet } from '@minotaur-ergo/types';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import Drawer from '@mui/material/Drawer';

import useTxBoxes from '@/hooks/useTxBoxes';

import { TxDataContext } from '../context/TxDataContext';
import BoxItem from './BoxItem';

interface TransactionBoxesPropsType {
  open: boolean;
  handleClose: () => void;
  signed?: wasm.Transaction;
  boxes?: Array<wasm.ErgoBox>;
  wallet?: StateWallet;
}

const TransactionBoxes = (props: TransactionBoxesPropsType) => {
  const context = useContext(TxDataContext);
  const { inputBoxes, outputBoxes } = useTxBoxes(
    props.wallet ?? context.wallet,
    props.boxes ?? context.boxes,
    props.signed ?? context.tx,
  );
  const networkType = context.networkType
    ? context.networkType
    : (props.wallet?.networkType ?? '');
  return (
    <Drawer
      anchor="bottom"
      open={props.open}
      onClose={props.handleClose}
      PaperProps={{
        sx: { p: 3, pt: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
      }}
    >
      <Box display="flex" mb={2}>
        <Box sx={{ flexBasis: 40 }} />
        <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
          Boxes
        </Typography>
        <IconButton onClick={props.handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="h2">Transaction Inputs</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        These elements spent in transaction
      </Typography>
      <Stack spacing={1}>
        {inputBoxes.map((item, index) => (
          <BoxItem
            tokens={item.tokens}
            networkType={networkType}
            address={item.address}
            amount={item.amount}
            key={index}
            wallet={context.wallet}
          />
        ))}
      </Stack>

      <Typography variant="h2" sx={{ mt: 3 }}>
        Transaction Outputs
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        These elements will be created in transaction
      </Typography>
      <Stack spacing={1}>
        {outputBoxes.map((item, index) => (
          <BoxItem
            tokens={item.tokens}
            networkType={networkType}
            address={item.address}
            amount={item.amount}
            key={index}
            wallet={context.wallet}
          />
        ))}
      </Stack>
    </Drawer>
  );
};

export default TransactionBoxes;
