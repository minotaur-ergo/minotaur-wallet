import { Box, CircularProgress, Typography } from '@mui/material';
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
  displayError?: string | null;
  clearError?: () => void;
}

const mapErrorToMessage = (err: unknown): string => {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('insufficient')) return 'Your balance is too low.';
    if (msg.includes('network')) return 'Network error. Try again later.';
    if (msg.includes('timeout'))
      return 'Request timed out. Check your connection.';
    if (msg.includes('signature')) return 'Signing failed. Try again.';
    return err.message;
  }
  return JSON.stringify(err);
};

const SignTx = (props: SignTxPropsType) => {
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const generatorContext = useContext(TxGenerateContext);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    generatorContext.setReady(true);
  }, [generatorContext]);

  useEffect(() => {
    props.setHasError(
      !!txSignContext.error || !!localError || !!props.displayError,
    );
  }, [txSignContext.error, localError, props.displayError, props]);

  const handleSigningError = (err: unknown) => {
    const readable = mapErrorToMessage(err);
    console.error('Signing Error:', err);
    setLocalError(readable);
  };

  useEffect(() => {
    if (!props.displayError) {
      setLocalError(null);
    }
  }, [props.displayError]);

  const displayError =
    props.displayError ||
    (txSignContext.error ? mapErrorToMessage(txSignContext.error) : localError);

  if (txDataContext.tx) {
    return (
      <TxSignStatusDisplay status={txSignContext.status}>
        <React.Fragment>
          <TxSignValues
            tx={txDataContext.tx}
            boxes={txDataContext.boxes}
            wallet={props.wallet}
          />
          {/* {displayError && (
            <Box sx={{ p: 2 }}>
              <StateMessage
                title="Transaction Error"
                description={displayError}
                color="error"
              />
            </Box>
          )} */}
          {txSignContext.signed ? (
            <>
              <Typography>
                Please scan this code on your hot wallet to submit transaction
              </Typography>
              <DisplayQRCode
                value={txSignContext.signed}
                type={QrCodeTypeEnum.ColdSignTransaction}
              />
            </>
          ) : (
            <SigningSwitch
              wallet={props.wallet}
              setHasError={(hasError) => {
                if (hasError) {
                  handleSigningError(new Error('Signing failed'));
                } else {
                  setLocalError(null);
                }
              }}
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
      {displayError ? (
        <Box sx={{ p: 2 }}>
          <StateMessage
            title="Transaction Error"
            description={displayError}
            color="error"
          />
        </Box>
      ) : (
        <StateMessage
          title="Generating Transaction"
          description="Please wait"
          icon={<CircularProgress />}
        />
      )}
    </Box>
  );
};

export default SignTx;
