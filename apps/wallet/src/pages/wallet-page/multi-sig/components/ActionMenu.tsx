import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/DeleteForeverOutlined';
import BoxIcon from '@mui/icons-material/Inventory2Outlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';

import { MultiStoreDbAction } from '@/action/db';
import { MultiSigContext } from '@/components/sign/context/MultiSigContext';

interface ActionMenuPropsType {
  openBoxes: () => unknown;
}
const ActionMenu = (props: ActionMenuPropsType) => {
  const context = useContext(MultiSigContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenBoxes = () => {
    setAnchorEl(null);
    props.openBoxes();
  };

  const handleDeleteRow = () => {
    setAnchorEl(null);
    // TODO add confirm
    MultiStoreDbAction.getInstance()
      .deleteEntireRow(context.rowId)
      .then(() => navigate(-1));
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleOpenMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleOpenBoxes}>
          <ListItemIcon>
            <BoxIcon />
          </ListItemIcon>
          Show Boxes
        </MenuItem>
        <MenuItem onClick={handleDeleteRow}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete Transaction
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default ActionMenu;
