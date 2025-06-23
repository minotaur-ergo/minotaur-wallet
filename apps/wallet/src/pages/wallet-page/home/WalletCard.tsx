import { useSelector } from 'react-redux';

import { StateWallet, GlobalStateType } from '@minotaur-ergo/types';
import { Box, Card, CardContent, Typography } from '@mui/material';

import ErgAmountDisplay from '@/components/amounts-display/ErgAmount';
import { WalletTypeLabel } from '@/db/entities/Wallet';
import { MAIN_NET_LABEL } from '@/utils/const';
import { ergPriceUsd } from '@/utils/functions';
import getChain from '@/utils/networks';

interface WalletCardPropsType {
  wallet: StateWallet;
}

const WalletCard = (props: WalletCardPropsType) => {
  const ergPrice = useSelector((state: GlobalStateType) => state.config.price);
  const color = {
    light: '#fffcb5',
    main: '#d7d02a',
  };
  return (
    <Card
      sx={{
        mb: 3,
        mx: -1,
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'transparent',
      }}
      elevation={3}
    >
      <Box
        sx={{
          position: 'absolute',
          zIndex: -1,
          width: '100%',
          height: '100%',
          backgroundColor: color.light,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          <circle cx={100} cy={0} r={50} fill={color.main} opacity={0.2} />
          <circle cx={0} cy={130} r={80} fill={color.main} opacity={0.1} />
        </svg>
      </Box>
      <CardContent>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="body2" color="textSecondary">
              Current Balance
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>
              <ErgAmountDisplay amount={BigInt(props.wallet.balance)} />
              <small>ERG</small>
            </Typography>
            {props.wallet.networkType === MAIN_NET_LABEL ? (
              <Typography>
                $ {ergPriceUsd(BigInt(props.wallet.balance), ergPrice)}
              </Typography>
            ) : null}
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {getChain(props.wallet.networkType).label}
            </Typography>
            <Typography variant="body2" color="textSecondary" textAlign="right">
              {WalletTypeLabel[props.wallet.type]}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: 80 }} />
        {/* <Button
          sx={{
            position: 'absolute',
            right: 0,
            bottom: '12%',
            color: '#00000066',
            backgroundColor: color.main + '66',
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: 20,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0,
            p: 1,
          }}
          startIcon={<ArrowDropDownIcon />}
          variant="text"
          fullWidth={false}
        >
          Mon.
        </Button> */}
      </CardContent>
    </Card>
  );
};
export default WalletCard;
