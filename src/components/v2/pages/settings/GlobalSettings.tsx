import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '../../components/Heading';
import SolitarySelectField from '../../components/SolitarySelectField';

const GlobalSettings = () => {
  const [data, setData] = useState({ currency: 'USD' });
  return (
    <Box mb={2}>
      <Heading title="Global Settings" />
      <Stack spacing={2}>
        <SolitarySelectField
          label="Currency conversion"
          value={data.currency}
          options={[{ value: 'USD' }, { value: 'IRT' }]}
          onChange={(newValue) =>
            setData((prevState) => ({ ...prevState, currency: newValue }))
          }
        />
      </Stack>
    </Box>
  );
};

export default GlobalSettings;
