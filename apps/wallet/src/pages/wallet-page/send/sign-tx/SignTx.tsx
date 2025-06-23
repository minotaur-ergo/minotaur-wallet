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

interface SignErrorType {
  detect: (error: unknown) => boolean;
  render: (error: unknown) => React.ReactNode;
  type: string;
}

const SignErrorTypes: SignErrorType[] = [
  {
    detect: (error) =>
      typeof error === 'string' && error.includes('insufficient funds'),
    render: () => <div> Insufficient funds. Please check your balance.</div>,
    type: 'InsufficientFunds',
  },
  {
    detect: (error) =>
      typeof error === 'string' && error.includes('network error'),
    render: () => <div> Network error. Please try again later.</div>,
    type: 'NetworkError',
  },
  {
    detect: (error) => typeof error === 'string' && error.includes('timeout'),
    render: () => <div> Request timed out. Try again.</div>,
    type: 'TimeoutError',
  },
];

interface SignTxPropsType {
  wallet: StateWallet;
  hideLoading?: boolean;
  setHasError: (hasError: boolean) => unknown;
}

const SignTx = (props: SignTxPropsType) => {
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const generatorContext = useContext(TxGenerateContext);

  const [localError, setLocalError] = useState<unknown | null>(null);

  useEffect(() => {
    generatorContext.setReady(true);
  }, [generatorContext]);

  if (txDataContext.tx) {
    return (
      <TxSignStatusDisplay status={txSignContext.status}>
        <>
          <TxSignValues
            tx={txDataContext.tx}
            boxes={txDataContext.boxes}
            wallet={props.wallet}
          />
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
              setHasError={(err: unknown) => {
                props.setHasError(true);
                setLocalError(err);
              }}
            />
          )}
        </>
      </TxSignStatusDisplay>
    );
  }

  const renderError = (error: unknown) => {
    const matched = SignErrorTypes.find((e) => e.detect(error));
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
          title="Transaction Signing Failed"
          description={matched ? String(matched.render(error)) : String(error)}
        />
      </Box>
    );
  };

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
