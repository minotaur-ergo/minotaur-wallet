import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext, useEffect } from 'react';
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
import { SignErrorTypes } from './SignErrorTypes';

interface SignTxPropsType {
  wallet: StateWallet;
  hideLoading?: boolean;
  setHasError: (hasError: boolean) => unknown;
}

const SignTx = (props: SignTxPropsType) => {
  const txSignContext = useContext(TxSignContext);
  const txDataContext = useContext(TxDataContext);
  const generatorContext = useContext(TxGenerateContext);

  const signError = txSignContext.error || generatorContext.error;

  useEffect(() => {
    generatorContext.setReady(true);
  }, [generatorContext]);

  useEffect(() => {
    if (signError) {
      props.setHasError(true);
    }
  }, [props, signError]);

  if (signError) {
    const matched = SignErrorTypes.find((type) => type.detect(signError));
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
              ? matched.render(signError)
              : `Unknown Error: ${String(signError)}`
          }
        />
      </Box>
    );
  }

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
              setHasError={props.setHasError}
            />
          )}
        </>
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
