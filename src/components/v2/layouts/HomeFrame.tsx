import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppFrame from './AppFrame';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { RouterMap } from '../V2Demo';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppToolbar from './AppToolbar';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

interface PropsType {
  children?: ReactNode;
}

const HomeFrame = ({ children }: PropsType) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handle_open_menu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handle_close_menu = () => {
    setAnchorEl(null);
  };
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
        <>
          <IconButton onClick={handle_open_menu}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handle_close_menu}>
            <MenuItem onClick={() => navigate(RouterMap.Settings)}>
              <ListItemIcon>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={() => navigate(RouterMap.AddressBook)}>
              <ListItemIcon>
                <ContactsOutlinedIcon />
              </ListItemIcon>
              Address book
            </MenuItem>
          </Menu>
        </>
      }
      toolbar={<AppToolbar />}
      disableToolbarPadding
    >
      {children}
    </AppFrame>
  );
};

export default HomeFrame;
