import { useState } from 'react';

type DrawerPropsType = {
  open: boolean;
  onClose: () => void;
};

type handleOpenType = () => void;

function useDrawer(): [handleOpen: () => void, drawerProps: DrawerPropsType] {
  const [open, setOpen] = useState(false);

  const handleOpen: handleOpenType = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const DrawerProps: DrawerPropsType = {
    open,
    onClose: handleClose,
  };

  return [handleOpen, DrawerProps];
}

export default useDrawer;
