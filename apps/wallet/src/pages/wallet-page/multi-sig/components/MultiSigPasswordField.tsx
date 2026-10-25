import { useContext } from 'react';

import PasswordField from '@/components/password-field/PasswordField';
import { MultiSigPasswordContext } from '@/components/sign/context/MultiSigPasswordContext';

// reads the password itself so typing does not re-render the whole page
const MultiSigPasswordField = () => {
  const { password, setPassword } = useContext(MultiSigPasswordContext);
  return (
    <PasswordField
      password={password}
      setPassword={setPassword}
      label="Wallet Password"
      helperText="Enter your wallet password to commit and sign this transaction."
    />
  );
};

export default MultiSigPasswordField;
