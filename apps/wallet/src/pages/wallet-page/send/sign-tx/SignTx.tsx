import React, { useContext, useEffect } from 'react';

import { QrCodeTypeEnum, StateWallet } from '@minotaur-ergo/types';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxGenerateContext from '@/components/sign/context/TxGenerateContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import StateMessage from '@/components/state-message/StateMessage';
import TxSignStatusDisplay from '@/components/tx-signing-status/TxSignStatusDisplay';

import SigningSwitch from './SigningSwitch';
import { TransactionErrorTypes } from './TransactionErrorType';
import TxSignValues from './TxSignValues';

interface SignTxPropsType {
  wallet: StateWallet;
  hideLoading?: boolean;
  setHasError: (hasError: boolean) => unknown;
}

const SignTx = (props: SignTxPropsType) => {
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const generatorContext = useContext(TxGenerateContext);

  useEffect(() => {
    generatorContext.setReady(true);
  });

  useEffect(() => {
    if (generatorContext.error) {
      props.setHasError(true);
    }
  }, [props, generatorContext.error]);

  if (generatorContext.error) {
    const matched = TransactionErrorTypes.find((type) =>
      type.detect(generatorContext.error),
    );
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <StateMessage
          color="error"
          title="Transaction Error"
          description={
            matched
              ? matched.render(generatorContext.error)
              : `Unknown Error: ${generatorContext.error}`
          }
        />
      </Box>
    );
  }

  if (txDataContext.tx) {
    return (
      <TxSignStatusDisplay status={txSignContext.status}>
        <React.Fragment>
          <TxSignValues
            tx={txDataContext.tx}
            boxes={txDataContext.boxes}
            wallet={props.wallet}
          />
          {txSignContext.signed ? (
            <React.Fragment>
              <Typography>
                Please scan this code on your hot wallet to submit transaction
              </Typography>
              <DisplayQRCode
                value={txSignContext.signed}
                type={QrCodeTypeEnum.ColdSignTransaction}
              />
            </React.Fragment>
          ) : (
            <SigningSwitch
              wallet={props.wallet}
              setHasError={props.setHasError}
            />
          )}
        </React.Fragment>
      </TxSignStatusDisplay>
    );
  }
  return props.hideLoading === true ? undefined : (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <StateMessage
        title="Generating Transaction"
        description="Please wait"
        icon={<CircularProgress />}
      />
    </Box>
  );
};

export default SignTx;
