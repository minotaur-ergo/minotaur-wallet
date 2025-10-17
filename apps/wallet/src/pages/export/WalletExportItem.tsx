import { ExportWallet, WalletType } from '@minotaur-ergo/types';
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
  wallet: ExportWallet;
  handleSelection: () => unknown;
  handleSecret: () => unknown;
}

const WalletExportItem = (props: WalletExportItemProps) => {
  return (
    <Box component="label" display="flex" gap={2}>
      <Checkbox checked={props.selected} onChange={props.handleSelection} />
      <Card sx={{ p: 2, flexGrow: 1 }}>
        <Typography>{props.wallet.name}</Typography>
        {props.wallet.type === WalletType.Normal ? (
          <FormControlLabel
            checked={props.secret}
            control={<Switch size="small" onChange={props.handleSecret} />}
            label={`${props.secret ? 'as Normal Wallet' : 'as ReadOnly Wallet'}`}
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
