import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import { IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

const Wallets = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  return (
    <AppFrame
      title="My Wallets"
      navigation={
        <IconButton onClick={handleBack}>
          <ArrowBackIosNewIcon />
        </IconButton>
      }
    ></AppFrame>
  );
};

export default Wallets;
