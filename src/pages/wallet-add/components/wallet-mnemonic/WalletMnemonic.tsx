import { useEffect, useState } from 'react';
import { Box, Slider, Typography, Alert, AlertTitle } from '@mui/material';
import InAdvancedMode from '@/components/display-view/InAdvancedMode';
import MnemonicPassphrase from '../mnemonic-passphrase/MnemonicPassphrase';
import MnemonicView from '../mnemonic-view/MnemonicView';

interface WalletMnemonicPropsType {
  mnemonic: string;
  mnemonicPassphrase: string;
  setHasError: (hasError: boolean) => unknown;
  newMnemonic: (size: number) => unknown;
  setMnemonicPassphrase: (mnemonicPassphrase: string) => unknown;
}

const WalletMnemonic = (props: WalletMnemonicPropsType) => {
  const [extended, setExtended] = useState(false);
  const words = props.mnemonic.split(' ');
  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number' && newValue !== words.length) {
      props.newMnemonic(newValue);
    }
  };
  useEffect(() => {
    if (!extended) {
      props.setHasError(false);
      props.setMnemonicPassphrase('');
    }
  });
  return (
    <Box>
      <Typography>
        Please save these words on paper (order is important). This mnemonic is
        the only way to recover your wallet.
      </Typography>
      <Alert severity="warning" variant="outlined" sx={{ my: 2 }}>
        <AlertTitle>Warning</AlertTitle>
        Never disclose your mnemonic.
        <br />
        Never type it on a website.
        <br />
        Do not store it electronically.
      </Alert>
      <Typography>
        You can choose different mnemonic lengths. 24-words mnemonic is
        recommended. The more mnemonic words, the more secure.{' '}
      </Typography>
      <InAdvancedMode>
        <Slider
          value={words.length}
          valueLabelDisplay="auto"
          step={3}
          marks
          onChange={handleChange}
          min={12}
          max={24}
          sx={{ width: 'calc(100% - 16px)' }}
        />
      </InAdvancedMode>
      <MnemonicView mnemonic={props.mnemonic} />
      <MnemonicPassphrase
        setPassword={props.setMnemonicPassphrase}
        setError={props.setHasError}
        password={props.mnemonicPassphrase}
        extended={extended}
        setExtended={setExtended}
      />
    </Box>
  );
};

export default WalletMnemonic;
