import { useContext, useEffect } from 'react';

import { StateWallet } from '@minotaur-ergo/types';
import { Box } from '@mui/material';

import { validatePassword } from '@/action/wallet';
import PasswordField from '@/components/password-field/PasswordField';
import TxSignContext from '@/components/sign/context/TxSignContext';

interface WalletSignNormalPropsType {
  wallet: StateWallet;
  setHasError: (hasError: boolean) => unknown;
}

const WalletSignNormal = (props: WalletSignNormalPropsType) => {
  const txSignContext = useContext(TxSignContext);
  useEffect(() => {
    props.setHasError(
      !validatePassword(props.wallet.seed, txSignContext.password),
    );
  });
  return (
    <Box>
      <PasswordField
        password={txSignContext.password}
        setPassword={txSignContext.setPassword}
        label="Wallet Password"
        helperText="Enter your wallet password to sign transaction"
      />
    </Box>
  );
};

export default WalletSignNormal;
