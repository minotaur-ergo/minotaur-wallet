import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import DisplayId from '@/components/display-id/DisplayId';
import { StateAddress } from '@/store/reducer/wallet';
import { ChainTypeInterface } from '@minotaur-ergo/types';
import { Stars } from '@mui/icons-material';
import { Box, Card, CardActionArea, Typography } from '@mui/material';

interface AddressItemDisplayPropsType {
  children?: React.ReactNode;
  onClick: () => unknown;
  address: StateAddress;
  chain: ChainTypeInterface;
}

const AddressItemDisplay = (props: AddressItemDisplayPropsType) => {
  return (
    <Card>
      <CardActionArea onClick={props.onClick} sx={{ p: 2 }}>
        <Box display="flex">
          <Typography sx={{ flexGrow: 1 }}>{props.address.name}</Typography>
          <Typography>
            <ErgAmountDisplay amount={BigInt(props.address.balance)} />{' '}
            <small>ERG</small>
          </Typography>
        </Box>
        {props.address.isDefault && (
          <Typography variant="body2" color="info.main" mb={1}>
            <Stars fontSize="inherit" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Default address
          </Typography>
        )}
        {props.address.tokens.length > 0 ? (
          <Typography variant="body2" color="textSecondary" mt={1}>
            Includes {props.address.tokens.length} token
            {props.address.tokens.length > 1 ? 's' : ''}
          </Typography>
        ) : null}
        <DisplayId
          variant="body2"
          color="textSecondary"
          id={props.address.address}
        />
      </CardActionArea>
      {props.children}
    </Card>
  );
};

export default AddressItemDisplay;
