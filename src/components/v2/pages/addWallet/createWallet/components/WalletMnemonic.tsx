import React from 'react';
import {
  Box,
  Chip,
  Slider,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  AlertTitle,
  Stack,
  FormHelperText,
  FormControl,
} from '@mui/material';
import PasswordField from '../../../../components/PasswordField';

export default function WalletMnemonic() {
  const words = ['east', 'when', 'betray', 'also', 'rescue', 'subway'];
  return (
    <Box>
      <Typography>
        Please save these words on paper (order is important). This mnemonic is
        the only way to recover your wallet.
      </Typography>
      <Alert severity="warning" sx={{ my: 2 }}>
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
      <Slider
        defaultValue={30}
        valueLabelDisplay="auto"
        step={3}
        marks
        min={12}
        max={24}
        sx={{ width: 'calc(100% - 16px)' }}
      />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
        {words.map((word, index) => (
          <Chip
            label={word}
            icon={
              <Typography
                color="textSecondary"
                sx={{ px: 0.5, fontSize: 'inherit' }}
              >
                {index + 1}
              </Typography>
            }
            key={index}
          />
        ))}
      </Box>
      <Stack spacing={2}>
        <FormControl>
          <FormControlLabel control={<Switch />} label="Extra password" />
          <FormHelperText>Extend mnemonic using extra password</FormHelperText>
        </FormControl>
        <PasswordField label="Mnemonic passphrase" />
        <PasswordField label="Confirm mnemonic passphrase" />
      </Stack>
    </Box>
  );
}
