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

export default function () {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Box>
      <FormControl>
        <InputLabel id="demo-simple-select-label">From Address</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value={10}>All Addresses</MenuItem>
          <MenuItem value={20}>Main Address</MenuItem>
          <MenuItem value={30}>Secondary Address</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" color="textSecondary" sx={{ mt: 1, p: 1 }}>
        Available:{' '}
        <Typography component="span" color="textPrimary">
          49.89
        </Typography>{' '}
        ERG
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ px: 1, display: 'flex' }}>
          <Typography sx={{ flexGrow: 1 }}>Receiver 1</Typography>
          <Button variant="text" fullWidth={false} sx={{ p: 0 }}>
            Remove
          </Button>
        </Box>
        <TextField label="Amount" />
        <TextField
          label="Receiver Address"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <QrCodeScannerIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Button variant="outlined">
        <AddIcon />
      </Button>
    </Box>
  );
}
