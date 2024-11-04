import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import { WalletType } from '@/db/entities/Wallet';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import AppFrame from '@/layouts/AppFrame';
import MultiSigCommunicationLocal from '@/pages/wallet-page/multi-sig/MultiSigCommunicationLocal';
import MultiSigCommunicationServer from '@/pages/wallet-page/multi-sig/MultiSigCommunicationServer';
import { getRoute, RouteMap } from '@/router/routerMap';
import { StateWallet } from '@/store/reducer/wallet';
import {
  LOCAL_MULTI_SIG_COMMUNICATION,
  SERVER_MULTI_SIG_COMMUNICATION,
} from '@/utils/const';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface MultiSigCommunicationPropsType {
  wallet: StateWallet;
}

const MultiSigCommunication = (props: MultiSigCommunicationPropsType) => {
  const params = useParams<{ type: string }>();
  const navigate = useNavigate();
  const signer = useSignerWallet(props.wallet);
  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    navigate(
      getRoute(RouteMap.WalletMultiSig, {
        id: props.wallet.id,
        type: newValue,
      }),
      { replace: true },
    );
  };
  const localAllowed = signer && signer.type === WalletType.Normal;
  console.log(localAllowed)
  return (
    <AppFrame title="Multi-sig Communication" navigation={<BackButtonRouter />}>
      {localAllowed ? (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={params.type}
            onChange={handleChangeTab}
            variant="fullWidth"
          >
            <Tab label="Local" value={LOCAL_MULTI_SIG_COMMUNICATION} />
            <Tab label="Server" value={SERVER_MULTI_SIG_COMMUNICATION} />
          </Tabs>
        </Box>
      ) : ''}
      {localAllowed && params.type === LOCAL_MULTI_SIG_COMMUNICATION ? (
        <MultiSigCommunicationLocal wallet={props.wallet} />
      ) : (
        <MultiSigCommunicationServer wallet={props.wallet} />
      )}
    </AppFrame>
  );
};

export default MultiSigCommunication;
