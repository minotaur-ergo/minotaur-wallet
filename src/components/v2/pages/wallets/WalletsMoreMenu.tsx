import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { RouterMap } from '../../V2Demo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Add, FileUploadOutlined } from '@mui/icons-material';

const WalletsMoreMenu = () => {
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
        <MenuItem onClick={() => navigate(RouterMap.AddWallet)}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          Add new wallet
        </MenuItem>
        <MenuItem onClick={() => navigate(RouterMap.ExportWallet)}>
          <ListItemIcon>
            <FileUploadOutlined />
          </ListItemIcon>
          Export wallet
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default WalletsMoreMenu;
