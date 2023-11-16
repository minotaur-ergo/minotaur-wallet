import { ReactNode } from 'react';
import DropdownMenu from './DropdownMenu';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MoreMenu = ({ children }: { children: ReactNode }) => {
  return (
    <DropdownMenu
      button={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
    >
      {children}
    </DropdownMenu>
  );
};

export default MoreMenu;
