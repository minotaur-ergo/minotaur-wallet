import React from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';

interface PropsType {
  open: boolean;
  handleClose: () => void;
}

export default function ({ open, handleClose }: PropsType) {
  const boxes = {
    spent: [
      {
        amount: 3.0011,
        id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
      },
    ],
    created: [
      {
        amount: 3,
        id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
      },
      {
        amount: 0.0011,
        id: '6506add086b2eae7ef2c25f71cb236830841bd1d6add086b2eae7eeae7ef',
      },
    ],
  };
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { p: 3, pt: 1, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
      }}
    >
      <Box display="flex" mb={2}>
        <Box sx={{ flexBasis: 40 }} />
        <Typography variant="h1" textAlign="center" sx={{ p: 1 }}>
          SigmaUSD
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="h2" gutterBottom>
        What is SigmaUSD
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        gutterBottom
        sx={{ mb: 2 }}
      >
        SigmaUSD is an instance of ageUSD protocol on Ergo.
      </Typography>

      <Typography variant="h2" gutterBottom>
        Fees
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        The SigmaUSD protocol fee parameter are:
      </Typography>
    </Drawer>
  );
}
