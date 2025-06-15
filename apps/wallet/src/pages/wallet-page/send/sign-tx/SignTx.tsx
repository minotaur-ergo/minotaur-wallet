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
}

const mapErrorToMessage = (err: unknown): string => {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('insufficient funds')) return 'Your balance is too low.';
    if (msg.includes('network'))
      return 'Network error. Please try again later.';
    if (msg.includes('timeout'))
      return 'Request timed out. Check your internet connection.';
    if (msg.includes('signature')) return 'Signing failed. Please try again.';
    return err.message;
  }
  return JSON.stringify(err);
};

const SignTx = (props: SignTxPropsType) => {
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const generatorContext = useContext(TxGenerateContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generatorContext.setReady(true);
  }, [generatorContext]);

  useEffect(() => {
    if (error) {
      console.error('Transaction Error:', {
        error,
        wallet: props.wallet.id,
        status: txSignContext.status,
        hasTx: !!txDataContext.tx,
        receivers: generatorContext.receivers,
        total: generatorContext.total,
      });
      props.setHasError(true);
    } else {
      props.setHasError(false);
    }
  }, [
    error,
    props.wallet.id,
    txSignContext.status,
    txDataContext.tx,
    generatorContext.receivers,
    generatorContext.total,
    props,
  ]);

  // if (error) {
  //   return (
  //     <Box sx={{  height: '100%',display: 'flex',justifyContent: 'center', }}>
  //       <Typography variant="body1" color="error">
  //         {error}
  //       </Typography>
  //     </Box>
  //   );
  // }

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
              setHasError={(hasError) => {
                if (hasError) {
                  try {
                    throw new Error('Signing failed');
                  } catch (err) {
                    const readable = mapErrorToMessage(err);
                    console.error('Signing Error:', err);
                    setError(readable);
                  }
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
      {error ? (
        <Box sx={{ p: 2 }}>
          <StateMessage
            title="Transaction Error"
            description={error}
            // icon={<Icon color="error" />}
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
