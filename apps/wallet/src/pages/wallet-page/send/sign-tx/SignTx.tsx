import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect, useState } from 'react';
import { TxDataContext } from '@/components/sign/context/TxDataContext';
import TxGenerateContext from '@/components/sign/context/TxGenerateContext';
import TxSignContext from '@/components/sign/context/TxSignContext';
import StateMessage from '@/components/state-message/StateMessage';
import { StateWallet } from '@/store/reducer/wallet';
import SigningSwitch from './SigningSwitch';
import TxSignValues from './TxSignValues';
import DisplayQRCode from '@/components/display-qrcode/DisplayQRCode';
import { QrCodeTypeEnum } from '@/types/qrcode';
import TxSignStatusDisplay from '@/components/tx-signing-status/TxSignStatusDisplay';

interface SignTxPropsType {
  wallet: StateWallet;
  hideLoading?: boolean;
  setHasError: (hasError: boolean) => unknown;
}

const SignTx = (props: SignTxPropsType) => {
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const generatorContext = useContext(TxGenerateContext);

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    generatorContext.setReady(true);
  }, [generatorContext]);

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
              setHasError={(err: unknown) => {
                props.setHasError(true);

                if (typeof err === 'string') {
                  if (err.includes('Wrong password')) {
                    setLocalError('Incorrect password. Please try again.');
                  } else if (err.includes('Network error')) {
                    setLocalError(
                      'Network error. Check your internet connection.',
                    );
                  } else {
                    setLocalError(err);
                  }
                } else if (err instanceof Error) {
                  setLocalError(err.message || 'An unknown error occurred.');
                } else {
                  setLocalError(String(err));
                }
              }}
            />
          )}
        </React.Fragment>
      </TxSignStatusDisplay>
    );
  }

  const renderError = (message: string) => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <StateMessage title="Transaction Signing Failed" description={message} />
    </Box>
  );
  if (localError) {
    return renderError(localError);
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
