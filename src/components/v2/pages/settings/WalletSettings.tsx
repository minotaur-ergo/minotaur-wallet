import React, { useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import Heading from '../../components/Heading';
import { Edit } from '@mui/icons-material';

const WalletSettings = () => {
  const [data, setData] = useState({ name: 'My First Wallet' });
  return (
    <Box mb={2}>
      <Heading title="Wallet Settings" />
      <TextField
        label="Wallet name"
        value={data.name}
        inputProps={{ readOnly: true }}
        // onChange={(e) =>
        //   setData((prevState: WalletDataType) => ({
        //     ...prevState,
        //     name: e.target.value,
        //   }))
        // }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
                <Edit />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default WalletSettings;
