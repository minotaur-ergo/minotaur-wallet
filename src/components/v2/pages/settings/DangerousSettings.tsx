import React from 'react';
import { Box, Stack } from '@mui/material';
import Heading from '../../components/Heading';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ActionButtonWithConfirm from './ActionButtonWithConfirm';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

const DangerousSettings = () => {
  const navigate = useNavigate();

  const handle_remove_wallet = () =>
    new Promise<string | undefined>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.5) {
          resolve(undefined);
          navigate(RouterMap.Wallets, {
            state: { message: 'Wallet removed successfully.' },
          });
        } else {
          reject('Error!');
        }
      }, 1000);
    });

  return (
    <Box mb={2}>
      <Heading title="Danger Zone" />
      <Stack spacing={2}>
        <ActionButtonWithConfirm
          label="Remove wallet"
          helperText="Some description about this option goes here."
          icon={<DeleteOutlineOutlinedIcon />}
          confirmButtonText="Remove"
          confirmTitle="Remove Wallet?!"
          confirmDescription="Are you sure you want to remove wallet?"
          onClick={handle_remove_wallet}
        />
      </Stack>
    </Box>
  );
};

export default DangerousSettings;
