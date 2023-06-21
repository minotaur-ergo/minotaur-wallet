import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

export default function () {
  const navigate = useNavigate();
  return (
    <Box mb={2}>
      <Button
        sx={{
          justifyContent: 'left',
          p: 2,
          bgcolor: 'primary.dark',
        }}
        onClick={() => navigate(RouterMap.MultiSigCom)}
      >
        <Typography>Multi-sig Communication</Typography>
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            right: 0,
            top: '50%',
            opacity: 0.25,
            transform: 'translateY(-50%) scale(2.5)',
            transformOrigin: 'center right',
          }}
        >
          <DrawOutlinedIcon />
        </Box>
      </Button>
    </Box>
  );
}
