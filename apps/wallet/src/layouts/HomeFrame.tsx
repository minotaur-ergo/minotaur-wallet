import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AppFrame from './AppFrame';
import { IconButton } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AppToolbar from './AppToolbar';
import { getRoute, RouteMap } from '@/router/routerMap';
import HomeAction from '@/components/home-action/HomeAction';

interface HomeFramePropsType {
  children?: ReactNode;
  title: string;
  id: number;
}

const HomeFrame = (props: HomeFramePropsType) => {
  const navigate = useNavigate();

  return (
    <AppFrame
      title={props.title}
      navigation={
        <IconButton onClick={() => navigate(getRoute(RouteMap.Wallets, {}))}>
          <AccountBalanceWalletOutlinedIcon />
        </IconButton>
      }
      actions={<HomeAction id={props.id} />}
      toolbar={<AppToolbar id={props.id} />}
      disableToolbarPadding
    >
      {props.children}
    </AppFrame>
  );
};

export default HomeFrame;
