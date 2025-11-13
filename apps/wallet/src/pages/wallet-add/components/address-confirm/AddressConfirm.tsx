import { useEffect, useState } from 'react';

import { deriveAddressFromMnemonic, getChain } from '@minotaur-ergo/utils';
import { Box, Card, Typography } from '@mui/material';

import CopyToClipboardIcon from '@/components/copy-to-clipboard/CopyToClipboardIcon';
import DisplayId from '@/components/display-id/DisplayId';

interface AddressConfirmPropsType {
  mnemonic: string;
  mnemonicPassphrase: string;
  network: string;
}

const AddressConfirm = (props: AddressConfirmPropsType) => {
  const [stored, setStored] = useState({
    address: '',
    mnemonic: '',
    passphrase: '',
  });
  useEffect(() => {
    if (
      stored.mnemonic !== props.mnemonic ||
      stored.passphrase !== props.mnemonicPassphrase
    ) {
      const chain = getChain(props.network);
      deriveAddressFromMnemonic(
        props.mnemonic,
        props.mnemonicPassphrase,
        chain.prefix,
        0,
      ).then((result) => {
        setStored({
          address: result.address,
          mnemonic: props.mnemonic,
          passphrase: props.mnemonicPassphrase,
        });
      });
    }
  });
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mt: 1, p: 1 }}>
        This is your main address.
        <br />
        Please check it. if this is not your address you entered mnemonic or
        mnemonic passphrase wrong. double check it and try again
      </Typography>
      <Box>
        <Card sx={{ display: 'flex', bgcolor: 'info.light', p: 2 }}>
          <DisplayId id={stored.address} />
          <CopyToClipboardIcon text={stored.address} />
        </Card>
      </Box>
    </Box>
  );
};

export default AddressConfirm;
