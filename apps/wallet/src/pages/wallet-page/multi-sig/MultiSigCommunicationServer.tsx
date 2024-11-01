import LoadingPage from '@/components/loading-page/LoadingPage';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import useCommunicationSecret from '@/hooks/signing-server/useCommunicationSecret';
import useRegisteredTeam from '@/hooks/signing-server/useRegisteredTeam';
import { getRoute, RouteMap } from '@/router/routerMap';
import React from 'react';
import { StateWallet } from '@/store/reducer/wallet';
import { ChevronRight } from '@mui/icons-material';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface MultiSigCommunicationServerPropsType {
  wallet: StateWallet;
}

const MultiSigCommunicationServer = (
  props: MultiSigCommunicationServerPropsType,
) => {
  const navigate = useNavigate();
  // const [lastUpdate, setLastUpdate] = useState(0)
  const signer = useSignerWallet(props.wallet);
  const secretLoading = useCommunicationSecret(props.wallet.id, 0);
  const { team, loading } = useRegisteredTeam(
    secretLoading.server,
    props.wallet,
    signer,
  );
  const registered = team?.xpubs.filter((item) => item.registered).length ?? 0;
  return (
    <React.Fragment>
      {secretLoading.loading || loading ? (
        <LoadingPage></LoadingPage>
      ) : (
        <React.Fragment>
          {team && registered < team.m ? (
            <Alert severity="warning" icon={false} sx={{ mb: 2 }}>
              <AlertTitle>{team.m - registered} more registers!</AlertTitle>
              {registered} of {team.m} required signers are registered.
            </Alert>
          ) : undefined}
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() =>
              navigate(
                getRoute(RouteMap.WalletMultiSigRegistration, {
                  id: props.wallet.id,
                }),
              )
            }
            sx={{ mb: 2 }}
          >
            {team ? 'View Registration' : 'Register'}
          </Button>
        </React.Fragment>
      )}

      {/*<Alert severity="warning" icon={false} sx={{ mb: 2 }}>*/}
      {/*  <AlertTitle>*/}
      {/*    /!*{registrationState.requiredSignatures - registerCount} more*!/*/}
      {/*    registers!*/}
      {/*  </AlertTitle>*/}
      {/*  /!*{registerCount} of {registrationState.requiredSignatures} required*!/*/}
      {/*  signers are registered.*/}
      {/*</Alert>*/}
      {/*<Button*/}
      {/*  variant="outlined"*/}
      {/*  endIcon={<ChevronRight />}*/}
      {/*  onClick={() => navigate(getRoute(RouteMap.WalletMultiSigRegistration, {id: props.wallet.id}))}*/}
      {/*  sx={{ mb: 2 }}*/}
      {/*>*/}
      {/*  Register*/}
      {/*</Button>*/}

      {/*<ListController*/}
      {/*  ListItem={<MultiSigTransactionItem />}*/}
      {/*  getData={getTransactions}*/}
      {/*  divider={false}*/}
      {/*  emptyTitle="There is no transaction in progress!"*/}
      {/*  emptyDescription="You can..."*/}
      {/*  emptyIcon="folder"*/}
      {/*/>*/}
    </React.Fragment>
  );
};

export default MultiSigCommunicationServer;
