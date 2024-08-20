import { Box, Button, Typography } from '@mui/material';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { getRoute, RouteMap } from '@/router/routerMap';
import { useNavigate } from 'react-router-dom';

interface MultiSigCommunicationButtonPropsType {
  walletId: number;
}
const MultiSigCommunicationButton = (
  props: MultiSigCommunicationButtonPropsType,
) => {
  const navigate = useNavigate();
  return (
    <Box mb={2}>
      <Button
        sx={{
          justifyContent: 'left',
          p: 2,
          bgcolor: 'primary.dark',
        }}
        onClick={() =>
          navigate(getRoute(RouteMap.WalletMultiSig, { id: props.walletId }))
        }
      >
        <Typography>Multi-sig Communication</Typography>
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            right: 0,
            top: '50%',
            opacity: 0.25,
            transform: 'translateY(-50%) scale(2.5)',
            transformOrigin: 'center right',
          }}
        >
          <DrawOutlinedIcon />
        </Box>
      </Button>
    </Box>
  );
};

export default MultiSigCommunicationButton;
