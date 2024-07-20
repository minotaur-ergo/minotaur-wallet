import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { RouterMap } from '../../V2Demo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Add,
  FileDownloadOutlined,
  FileUploadOutlined,
} from '@mui/icons-material';

const AddressBookMoreMenu = () => {
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
        <MenuItem onClick={() => navigate(RouterMap.AddAddress)}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          Add new address
        </MenuItem>
        <MenuItem onClick={() => navigate(RouterMap.ExportAddress)}>
          <ListItemIcon>
            <FileUploadOutlined />
          </ListItemIcon>
          Export address
        </MenuItem>
        <MenuItem onClick={() => navigate(RouterMap.ImportAddress)}>
          <ListItemIcon>
            <FileDownloadOutlined />
          </ListItemIcon>
          Import address
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default AddressBookMoreMenu;
