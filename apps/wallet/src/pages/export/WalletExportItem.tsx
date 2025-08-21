import { StateWallet, WalletType } from '@minotaur-ergo/types';
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';

interface WalletExportItemProps {
  selected: boolean;
  secret: boolean;
  wallet: StateWallet;
  handleSelection: (selected: boolean) => unknown;
  handleSecret: (secret: boolean) => unknown;
}

const WalletExportItem = (props: WalletExportItemProps) => {
  return (
    <Box component="label" display="flex" gap={2}>
      <Checkbox
        checked={props.selected}
        onChange={() => props.handleSelection(!props.selected)}
      />
      <Card sx={{ p: 2, flexGrow: 1 }}>
        <Typography>{props.wallet.name}</Typography>
        {props.wallet.type === WalletType.Normal ? (
          <FormControlLabel
            checked={props.secret}
            control={
              <Switch
                size="small"
                onChange={() => props.handleSecret(!props.secret)}
              />
            }
            label={`${props.secret ? 'as ReadOnly Wallet' : 'as Normal Wallet'}`}
            slotProps={{
              typography: {
                fontSize: 'small',
                color: props.secret ? 'text.primary' : 'text.secondary',
              },
            }}
          />
        ) : null}
      </Card>
    </Box>
  );
};

export default WalletExportItem;
