import React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AddIcon from '@mui/icons-material/Add';
import PasswordField from '../../../components/PasswordField';

export default function () {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, p: 1 }}>
        Total Spent:{' '}
        <Typography component="span" color="textPrimary">
          3.0011
        </Typography>{' '}
        ERG
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, p: 1 }}>
        These amount will be spent when transaction proceed.
      </Typography>

      <PasswordField
        label="Wallet Password"
        helperText="Enter your mnemonic passphrase to send transaction."
      />
    </Box>
  );
}
