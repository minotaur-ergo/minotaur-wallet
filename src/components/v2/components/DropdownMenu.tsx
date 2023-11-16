import { Menu } from '@mui/material';
import {
  Fragment,
  ReactElement,
  ReactNode,
  cloneElement,
  useState,
} from 'react';

interface DropdownMenuPropsType {
  button: ReactElement;
  children: ReactNode;
}

const DropdownMenu = (props: DropdownMenuPropsType) => {
  const { button, children } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handle_open_menu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handle_close_menu = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      {cloneElement(button, { onClick: handle_open_menu })}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handle_close_menu}
        onClick={handle_close_menu}
      >
        {children}
      </Menu>
    </Fragment>
  );
};

export default DropdownMenu;
