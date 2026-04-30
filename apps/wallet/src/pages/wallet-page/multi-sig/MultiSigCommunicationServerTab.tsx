import { useNavigate } from 'react-router-dom';

import { StateWallet } from '@minotaur-ergo/types';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, Button } from '@mui/material';

import { getRoute, RouteMap } from '@/router/routerMap';

interface MultiSigCommunicationServerTabPropsType {
  wallet: StateWallet;
}
const MultiSigCommunicationServerTab = (
  props: MultiSigCommunicationServerTabPropsType,
) => {
  const navigate = useNavigate();
  return (
    <Box mt={1}>
      <Button
        onClick={() =>
          navigate(
            getRoute(RouteMap.WalletMultiSigRegisterServer, {
              id: props.wallet.id,
            }),
          )
        }
        fullWidth
        sx={{
          bgcolor: '#EAEAEA80',
          borderRadius: 1,
          py: '8px',
          color: 'primary.main',
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: '0.48px',
        }}
        endIcon={<ChevronRightRoundedIcon />}
      >
        REGISTER
      </Button>
    </Box>
  );
};

export default MultiSigCommunicationServerTab;
