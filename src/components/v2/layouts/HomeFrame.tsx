import { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppFrame from './AppFrame';
import { IconButton } from '@mui/material';
import { RouterMap } from '../V2Demo';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AppToolbar from './AppToolbar';
import HomeMoreMenu from './HomeMoreMenu';
import { WALLETS } from '../data';

interface PropsType {
  children?: ReactNode;
}

const HomeFrame = ({ children }: PropsType) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const wallet = WALLETS.find((row) => row.id === id);

  return (
    <AppFrame
      title={wallet?.name || ''}
      navigation={
        <IconButton onClick={() => navigate(RouterMap.Wallets)}>
          <AccountBalanceWalletOutlinedIcon />
        </IconButton>
      }
      actions={<HomeMoreMenu />}
      toolbar={<AppToolbar />}
      disableToolbarPadding
    >
      {children}
    </AppFrame>
  );
};

export default HomeFrame;
