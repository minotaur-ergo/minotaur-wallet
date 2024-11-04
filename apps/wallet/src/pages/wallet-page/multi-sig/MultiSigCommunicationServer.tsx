import ListController from '@/components/list-controller/ListController';
import LoadingPage from '@/components/loading-page/LoadingPage';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import useCommunicationSecret from '@/hooks/signing-server/useCommunicationSecret';
import useReducedTxs from '@/hooks/signing-server/useReducedTxs';
import useRegisteredTeam from '@/hooks/signing-server/useRegisteredTeam';
import MultiSigTransactionItem from '@/pages/wallet-page/multi-sig/MultiSigTransactionItem';
import { getRoute, RouteMap } from '@/router/routerMap';
import { SERVER_MULTI_SIG_COMMUNICATION } from '@/utils/const';
import React from 'react';
import { StateWallet } from '@/store/reducer/wallet';
import { ChevronRight } from '@mui/icons-material';
import { Alert, AlertTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface MultiSigCommunicationServerPropsType {
  wallet: StateWallet;
}

const MultiSigCommunicationServer = (
  props: MultiSigCommunicationServerPropsType
) => {
  const navigate = useNavigate();
  const signer = useSignerWallet(props.wallet);
  const secretLoading = useCommunicationSecret(props.wallet.id, 0);
  const reduced = useReducedTxs(
    secretLoading.server ?? undefined,
    props.wallet,
    signer
  );
  const { team, loading } = useRegisteredTeam(
    secretLoading.server,
    props.wallet,
    signer
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
                  id: props.wallet.id
                })
              )
            }
            sx={{ mb: 2 }}
          >
            {team ? 'View Registration' : 'Register'}
          </Button>
        </React.Fragment>
      )}
      {registered ? (
        <ListController
          loading={loading}
          error={false}
          errorDescription={''}
          errorTitle={''}
          data={reduced.rows}
          render={(row) => (
            <MultiSigTransactionItem
              wallet={props.wallet}
              txId={row.txId}
              ergIn={row.ergIn}
              ergOut={row.ergOut}
              signs={row.signed}
              commitments={row.committed}
              tokensIn={row.tokensIn}
              tokensOut={row.tokensOut}
              route={getRoute(RouteMap.WalletMultiSigTxView, {
                id: props.wallet.id,
                type: SERVER_MULTI_SIG_COMMUNICATION,
                txId: row.rowId
              })}
            />
          )}
          divider={false}
          emptyTitle="There is no transaction in progress!"
          emptyDescription="You can add transaction using botton below to start signing process"
          emptyIcon="folder"
        />
      ) : undefined}
    </React.Fragment>
  );
};

export default MultiSigCommunicationServer;
