import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { RouterMap } from '../V2Demo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const HomeMoreMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handle_open_menu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handle_close_menu = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
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
        <MenuItem onClick={() => navigate(RouterMap.Scan)}>
          <ListItemIcon>
            <QrCodeScannerIcon />
          </ListItemIcon>
          Scan QR
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default HomeMoreMenu;
