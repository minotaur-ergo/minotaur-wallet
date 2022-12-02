import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import BackButton from '../../components/BackButton';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';

const Wallets = () => {
  const navigate = useNavigate();

  return (
    <AppFrame
      title="My Wallets"
      navigation={<BackButton />}
      actions={
        <IconButton onClick={() => navigate(RouterMap.CreateWallet)}>
          <AddIcon />
        </IconButton>
      }
    ></AppFrame>
  );
};

export default Wallets;
