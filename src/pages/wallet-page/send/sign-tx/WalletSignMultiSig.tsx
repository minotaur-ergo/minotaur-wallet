import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import useReducedTx from '@/hooks/useReducedTx';
import { StateWallet } from '@/store/reducer/wallet';
import { useSignerWallet } from '@/hooks/multi-sig/useSignerWallet';
import { WalletType } from '@/db/entities/Wallet';
import WalletSignReadonly from './WalletSignReadonly';

interface WalletSignMultiSigPropsType {
  networkType: string;
  wallet: StateWallet;
  setHasError: (hasError: boolean) => unknown;
}

const WalletSignMultiSig = (props: WalletSignMultiSigPropsType) => {
  const isValid = useReducedTx();
  useEffect(() => {
    props.setHasError(isValid);
  });
  const signer = useSignerWallet(props.wallet);
  if (signer?.type === WalletType.ReadOnly) {
    return (
      <WalletSignReadonly
        wallet={props.wallet}
        setHasError={props.setHasError}
      />
    );
  }
  return (
    <Box>
      <Typography>
        Click start sign to move multi-sig transaction in
        multi-sig-communication page
      </Typography>
    </Box>
  );
};

export default WalletSignMultiSig;
