import React, { Fragment, useState } from 'react';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { WorkOffOutlined, WorkOutlineOutlined } from '@mui/icons-material';

interface WalletsGroupMoreMenuProps {
  showArchived: boolean;
  setShowArchived: (value: boolean) => void;
}

const WalletsGroupMoreMenu = ({
  setShowArchived,
  showArchived,
}: WalletsGroupMoreMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handle_open_menu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handle_close_menu = () => {
    setAnchorEl(null);
  };

  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
    localStorage.setItem('showArchived', JSON.stringify(!showArchived));
    handle_close_menu();
  };

  return (
    <Fragment>
      <IconButton onClick={handle_open_menu}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handle_close_menu}>
        <MenuItem onClick={handleToggleArchived}>
          <ListItemIcon>
            {showArchived ? <WorkOffOutlined /> : <WorkOutlineOutlined />}
          </ListItemIcon>
          {showArchived ? 'Hide Archived' : 'Show Archived'}
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default WalletsGroupMoreMenu;
