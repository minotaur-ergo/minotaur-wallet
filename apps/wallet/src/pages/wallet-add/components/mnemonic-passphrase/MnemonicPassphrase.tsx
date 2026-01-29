import React, { useEffect, useState } from 'react';

import { FormControlLabel, Switch } from '@mui/material';

import InAdvancedMode from '@/components/display-view/InAdvancedMode';
import PasswordField from '@/components/password-field/PasswordField';

interface MnemonicPassPhrasePropsType {
  setPassword: (newPassword: string) => unknown;
  setError: (hasError: boolean) => unknown;
  password: string;
  extended: boolean;
  setExtended: (extended: boolean) => unknown;
  samePassPhrase: boolean;
  setSamePassPhrase: (same: boolean) => unknown;
}

const MnemonicPassphrase = (props: MnemonicPassPhrasePropsType) => {
  const [passwordConfirm, setPasswordConfirm] = useState(props.password);

  useEffect(() => {
    props.setSamePassPhrase(props.password === passwordConfirm);
  });

  return (
    <InAdvancedMode>
      <FormControlLabel
        control={
          <Switch
            checked={props.extended}
            onChange={(event) => {
              props.setExtended(event.target.checked);
              if (!event.target.checked) {
                props.setPassword('');
                setPasswordConfirm('');
              }
            }}
          />
        }
        label="Extend mnemonic using extra password"
      />
      {props.extended ? (
        <React.Fragment>
          <PasswordField
            password={props.password}
            label="Mnemonic passphrase"
            setPassword={props.setPassword}
          />
          <PasswordField
            password={passwordConfirm}
            label="Confirm mnemonic passphrase"
            setPassword={setPasswordConfirm}
            helperText={props.samePassPhrase ? '' : 'passwords are not same'}
          />
        </React.Fragment>
      ) : null}
    </InAdvancedMode>
  );
};

export default MnemonicPassphrase;
