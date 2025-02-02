import { useState } from 'react';

type DrawerOutput = {
  handleOpen: () => unknown;
  open: boolean;
  handleClose: () => void;
};

type handleOpenType = () => void;

const useDrawer = (): DrawerOutput => {
  const [open, setOpen] = useState(false);

  const handleOpen: handleOpenType = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return {
    handleOpen,
    open,
    handleClose,
  };
};

export default useDrawer;
