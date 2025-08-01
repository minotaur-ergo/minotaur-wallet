import { useContext, useState } from 'react';

import { MultiSigStateEnum, StateWallet } from '@minotaur-ergo/types';
import { Box, Typography } from '@mui/material';

import BackButtonRouter from '@/components/back-button/BackButtonRouter';
import { DisplaySignedTx } from '@/components/display-signed-tx/DisplaySignedTx';
import LoadingPage from '@/components/loading-page/LoadingPage';
import PasswordField from '@/components/password-field/PasswordField';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';
import { MultiSigDataContext } from '@/components/sign/context/MultiSigDataContext';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TransactionBoxes from '@/components/sign/transaction-boxes/TransactionBoxes';
import { useCompletedTx } from '@/hooks/multi-sig/useCompletedTx';
import AppFrame from '@/layouts/AppFrame';

import TxSignValues from '../send/sign-tx/TxSignValues';
import ActionMenu from './components/ActionMenu';
import AddressActionList from './components/AddressActionList';
import MultiSigToolbar from './components/MultiSigToolbar';
import ShareTransaction from './components/ShareTransaction';
import StateAlert from './components/StateAlert';

interface MultiSigTransactionPropsType {
  wallet: StateWallet;
}

const MultiSigTransaction = (props: MultiSigTransactionPropsType) => {
  const txContext = useContext(MultiSigContext);
  const txDataContext = useContext(TxDataContext);
  const multiDataContext = useContext(MultiSigDataContext);
  const [displayBoxes, setDisplayBoxes] = useState(false);
  const needMyCommitment =
    multiDataContext.state === MultiSigStateEnum.COMMITMENT &&
    !multiDataContext.myAction.committed;
  const needMySign =
    multiDataContext.state === MultiSigStateEnum.SIGNING &&
    !multiDataContext.myAction.signed;
  const needAction = needMyCommitment || needMySign;
  useCompletedTx();
  if (txDataContext.tx) {
    return (
      <AppFrame
        title="Multi-sig Transaction"
        navigation={<BackButtonRouter />}
        actions={<ActionMenu openBoxes={() => setDisplayBoxes(true)} />}
        toolbar={<MultiSigToolbar />}
      >
        <StateAlert />
        <br />
        <TxSignValues
          boxes={txDataContext.boxes}
          wallet={props.wallet}
          tx={txDataContext.tx}
        />
        <Box my={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Transaction Committed by
          </Typography>
          <AddressActionList
            addresses={multiDataContext.actions.map((item) => ({
              address: item.address,
              completed: item.committed,
            }))}
          />
        </Box>
        {multiDataContext.state !== MultiSigStateEnum.COMMITMENT ? (
          <Box my={2}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Transaction Signed by
            </Typography>
            <AddressActionList
              addresses={multiDataContext.actions.map((item) => ({
                address: item.address,
                completed: item.signed,
              }))}
            />
          </Box>
        ) : null}
        {needAction ? (
          multiDataContext.needPassword ? (
            <PasswordField
              password={txContext.password}
              setPassword={txContext.setPassword}
              label="Wallet Password"
              helperText="Please enter your mnemonics passphrase to send transaction."
            />
          ) : null
        ) : txContext.signed ? (
          <DisplaySignedTx tx={txContext.signed} />
        ) : (
          <ShareTransaction />
        )}
        <TransactionBoxes
          open={displayBoxes}
          handleClose={() => setDisplayBoxes(false)}
        />
      </AppFrame>
    );
  }
  return <LoadingPage title={'Loading'} description={'Please wait'} />;
};

export default MultiSigTransaction;
