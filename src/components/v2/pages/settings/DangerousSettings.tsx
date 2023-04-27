import React from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '../../components/Heading';
import ActionButton from './ActionButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const DangerousSettings = () => {
  return (
    <Box mb={2}>
      <Heading title="Danger Zone" />
      <Stack spacing={2}>
        <ActionButton
          label="Remove wallet"
          helperText="Some description about this option goes here."
          icon={<DeleteOutlineOutlinedIcon />}
        />
      </Stack>
    </Box>
  );
};

export default DangerousSettings;
