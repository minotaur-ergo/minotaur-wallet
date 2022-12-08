import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AppFrame from './AppFrame';
import { IconButton } from '@mui/material';
import { RouterMap } from '../V2Demo';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppToolbar from './AppToolbar';

interface PropsType {
  children?: ReactNode;
}

const HomeFrame = ({ children }: PropsType) => {
  const navigate = useNavigate();
  const wallet = {
    name: 'My First Wallet',
  };

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
    >
      {children}
    </AppFrame>
  );
};

export default HomeFrame;
