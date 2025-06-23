import BackButton from '@/components/back-button/BackButton';
import AppFrame from '@/layouts/AppFrame';
import { Inventory } from '@mui/icons-material';
import { Button, Grid, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apps } from './apps/dapps';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import DAppDescription from './components/DappDescription';
import LoadingPage from '@/components/loading-page/LoadingPage';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import { useDAppConnectorProps } from '@/hooks/useDAppConnectorProps';
import { StateWallet } from '@minotaur-ergo/types';
import PrevIcon from '@mui/icons-material/ArrowBackIos';
import TxSignContext from '@/components/sign/context/TxSignContext';
import SignTx from '../send/sign-tx/SignTx';
import SignButtonLabel from '@/components/sign-button-label/SignButtonLabel';

interface WalletDAppViewPropsType {
  wallet: StateWallet;
}
const WalletDAppView = (props: WalletDAppViewPropsType) => {
  const navigate = useNavigate();
  const params = useParams<{ dAppId: string }>();
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const [hasError, setHasError] = useState(false);
  const txDataContext = useContext(TxDataContext);
  const txSignContext = useContext(TxSignContext);
  const dappProps = useDAppConnectorProps(props.wallet);
  const handleBack = () => {
    navigate(-1);
  };
  const handleDisplayBoxes = () => {
    setDisplayBoxes(true);
  };
  const handleHideBoxes = () => {
    setDisplayBoxes(false);
  };
  const getDApp = () => {
    const dApps = apps.filter((item) => item.id === params.dAppId);
    return dApps.length ? dApps[0] : null;
  };
  const closeTx = () => txSignContext.setTx(undefined, [], []);
  const app = getDApp();
  if (app) {
    const Component = app.component;
    return (
      <AppFrame
        title={app.name}
        navigation={<BackButton onClick={handleBack} />}
        actions={
          <React.Fragment>
            {txDataContext.tx !== undefined ? (
              <IconButton onClick={handleDisplayBoxes}>
                <Inventory />
              </IconButton>
            ) : undefined}
            <DAppDescription dapp={app} />
          </React.Fragment>
        }
        toolbar={
          txDataContext.tx !== undefined ? (
            <React.Fragment>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button onClick={closeTx} startIcon={<PrevIcon />}>
                    Back
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    disabled={hasError}
                    onClick={() => txSignContext.handle()}
                  >
                    <SignButtonLabel wallet={props.wallet} />
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          ) : undefined
        }
      >
        <TransactionBoxes open={displayBoxes} handleClose={handleHideBoxes} />
        {txDataContext.tx !== undefined ? (
          <SignTx setHasError={setHasError} wallet={props.wallet} />
        ) : undefined}
        <div
          style={{ display: txDataContext.tx === undefined ? 'block' : 'none' }}
        >
          <Component {...dappProps} />
        </div>
      </AppFrame>
    );
  }
  return <LoadingPage />;
};

export default WalletDAppView;
