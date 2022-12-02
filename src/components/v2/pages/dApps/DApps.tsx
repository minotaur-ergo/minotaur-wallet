import React from 'react';
import AppFrame from '../../layouts/AppFrame';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RouterMap } from '../../V2Demo';
import AppToolbar from '../../layouts/AppToolbar';

const DApps = () => {
  const navigate = useNavigate();
  const wallet = { name: 'My First Wallet' };

  return (
    <AppFrame
      title={wallet.name}
      navigation={
        <IconButton onClick={() => navigate(RouterMap.Wallets)}>
          <AccountBalanceWalletOutlinedIcon />
        </IconButton>
      }
      actions={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
      toolbar={<AppToolbar />}
      disableToolbarPadding
    ></AppFrame>
  );
};

export default DApps;
