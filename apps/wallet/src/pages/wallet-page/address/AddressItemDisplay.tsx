import { ChainTypeInterface, StateAddress } from '@minotaur-ergo/types';
import { Star } from '@mui/icons-material';
import { Box, Card, CardActionArea, Typography } from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import BalanceDisplay from '@/components/balance-display/BalanceDisplay';
import DisplayId from '@/components/display-id/DisplayId';

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
        <Box display="flex" alignItems="flex-start">
          <Typography sx={{ flexGrow: 1 }}>{props.address.name}</Typography>
          <Box sx={{ textAlign: 'right', ml: 2 }}>
            <Typography>
              <ErgAmountDisplay amount={BigInt(props.address.balance)} />{' '}
              <small>ERG</small>
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={1}>
          <DisplayId
            variant="body2"
            color="textSecondary"
            id={props.address.address}
            sx={{ flexGrow: 1, minWidth: 0 }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 2, whiteSpace: 'nowrap' }}
          >
            <BalanceDisplay
              amount={BigInt(props.address.balance)}
              tokenBalances={[]}
            />
          </Typography>
        </Box>
        {props.address.isDefault && (
          <Typography
            variant="body2"
            color="secondary.main"
            mt={1}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: '#F2EBD9',
              px: '8px',
              py: '2px',
              borderRadius: '4px',
            }}
          >
            <Star fontSize="inherit" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Default
          </Typography>
        )}
      </CardActionArea>
      {props.children}
    </Card>
  );
};

export default AddressItemDisplay;
