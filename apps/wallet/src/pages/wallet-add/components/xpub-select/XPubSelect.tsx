import { useEffect, useState } from 'react';

import { createEmptyArray } from '@minotaur-ergo/utils';
import { Stack } from '@mui/material';

import AddressOrXPub from '../address-or-xpub/AddressOrXPub';
import WalletSelect from '../wallet-select/WalletSelect';

interface XPubSelectPropsType {
  xPubs: Array<string>;
  walletId: string;
  networkType: string;
  setXPub: (xPubs: Array<string>) => unknown;
  setHasError: (hasError: boolean) => unknown;
  setWalletId: (walletId: string) => unknown;
}

const XPubSelect = (props: XPubSelectPropsType) => {
  const [errors, setErrors] = useState<Array<boolean>>([]);
  const xPubSetter = (index: number) => (xPub: string) => {
    const trimmed = xPub.trim();
    if (props.xPubs[index] !== trimmed) {
      const newXPubs = [...props.xPubs];
      newXPubs[index] = trimmed;
      props.setXPub(newXPubs);
    }
  };
  const setHasError = (index: number) => (hasError: boolean) => {
    if (errors.length >= index && errors[index] !== hasError) {
      const newErrors = [...errors];
      newErrors[index] = hasError;
      setErrors(newErrors);
    }
  };
  useEffect(() => {
    if (props.xPubs.length !== errors.length) {
      setErrors(createEmptyArray(props.xPubs.length, true));
    }
  }, [props.xPubs.length, errors.length]);
  useEffect(() => {
    props.setHasError(
      props.walletId === '' || errors.reduce((a, b) => a || b, false),
    );
  });
  return (
    <Stack spacing={2}>
      <WalletSelect
        networkType={props.networkType}
        label="Select Signer Wallet"
        walletId={props.walletId}
        select={props.setWalletId}
      />
      {props.xPubs.map((xPub, index) => (
        <AddressOrXPub
          key={`xpub-${index}`}
          label={`Enter extended public key #${index + 1}`}
          value={xPub}
          setValue={xPubSetter(index)}
          setHasError={setHasError(index)}
        />
      ))}
    </Stack>
  );
};

export default XPubSelect;
