import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import PasswordField from '@/components/password-field/PasswordField';

interface WalletPasswordPropsType {
  password: string;
  setHasError: (hasError: boolean) => unknown;
  setPassword: (password: string) => unknown;
}

const WalletPassword = (props: WalletPasswordPropsType) => {
  const [passwordConfirm, setPasswordConfirm] = useState('');
  useEffect(() => {
    if (props.password !== '') {
      props.setHasError(props.password !== passwordConfirm);
    } else {
      props.setHasError(true);
    }
  });
  return (
    <Box>
      <Typography>
        Choose a strong password to encrypt your wallet keys. If you forget this
        password, the only way to access your funds is recovering the wallet
        using the mnemonic.
      </Typography>
      <PasswordField
        password={props.password}
        label="Password"
        setPassword={props.setPassword}
      />
      <PasswordField
        password={passwordConfirm}
        label="PasswordConfirm"
        setPassword={setPasswordConfirm}
      />
    </Box>
  );
};

export default WalletPassword;
