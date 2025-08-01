import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Capacitor } from '@capacitor/core';
import {
  ContactsOutlined,
  Download,
  MoreVert,
  QrCodeScanner,
  SettingsOutlined,
} from '@mui/icons-material';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';

import { getRoute, RouteMap } from '@/router/routerMap';
import { downloadDb } from '@/utils/browser';

import { QrCodeContext } from '../qr-code-scanner/QrCodeContext';

interface HomeActionPropsType {
  id?: number;
  children?: React.ReactNode;
}

const HomeAction = (props: HomeActionPropsType) => {
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const startScanner = () => {
    setAnchorEl(null);
    qrCodeContext.start().then(() => null);
  };
  const qrCodeContext = useContext(QrCodeContext);
  const navigate = useNavigate();
  const settingUrl = props.id
    ? getRoute(RouteMap.WalletSettings, { id: props.id })
    : getRoute(RouteMap.Settings, {});
  return (
    <React.Fragment>
      {props.children}
      <IconButton onClick={startScanner}>
        <QrCodeScanner />
      </IconButton>
      <IconButton onClick={handleOpenMenu}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={() => navigate(settingUrl)}>
          <ListItemIcon>
            <SettingsOutlined />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => navigate(getRoute(RouteMap.AddressBook, {}))}>
          <ListItemIcon>
            <ContactsOutlined />
          </ListItemIcon>
          Address book
        </MenuItem>
        {Capacitor.getPlatform() === 'web' ? (
          <MenuItem
            onClick={() => {
              downloadDb();
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            Download Database
          </MenuItem>
        ) : null}
      </Menu>
    </React.Fragment>
  );
};

export default HomeAction;
